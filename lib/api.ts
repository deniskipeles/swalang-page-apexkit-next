import { getApexServer, apex } from './apexkit';
import { FileSystemNode } from './types';

// ==========================================
// SERVER-SIDE CALLS
// ==========================================
export async function getProjectServer(id: string, versionId?: string) {
  const server = await getApexServer();
  
  const res = await server.scripts.run('get-project', { 
    project_id: id, 
    version_id: versionId || null 
  });

  if (!res || !res.files) {
    throw new Error("Invalid response from get-project script");
  }

  // res.tree is now string[].
  // res.files is {path, content}[].
  // The UI will rebuild the visual tree from the paths.
  return {
    strategy: 'split',
    size: res.files.length,
    tree: res.files, // Passing files allows UI to build tree AND populate content
    files: res.files 
  };
}

export async function getUserProjects() {
  const server = await getApexServer();
  const res = await server.collection('projects').list({ 
    sort: '-created',
    expand: 'snapshots' 
  });

  return res.items.map(i => ({
    id: i.id,
    name: i.data.name,
    description: i.data.description,
    created_at: i.created,
    project_versions: i.expand?.snapshots || []
  }));
}

export interface ProjectVersion {
  id: string;
  version_label: string;
  created: string; 
}

export interface ProjectWithVersions {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  owner_id?: string;
  created_at: string;
  project_versions: ProjectVersion[];
}

export async function getProjectsList(page = 1, limit = 10, search = "", ownerId?: string) {
  let filter: any = {};
  
  if (ownerId) {
      filter.owner_id = ownerId; // Fetch user's projects
  } else {
      filter.is_public = true;   // Fetch public community projects
  }

  if (search) {
      filter.name = { "$contains": search };
  }

  const offset = (page - 1) * limit;

  const res = await apex.collection('projects').list({
      filter: JSON.stringify(filter),
      sort: '-created',
      expand: 'snapshots',
      limit: limit,
      offset: offset
  });

  const items: ProjectWithVersions[] = res.items.map((item: any) => {
      let versions: ProjectVersion[] = [];
      
      if (item.expand && item.expand.snapshots) {
          const snaps = Array.isArray(item.expand.snapshots) ? item.expand.snapshots : [item.expand.snapshots];
          versions = snaps.map((s: any) => ({
              id: s.id,
              version_label: s.data?.version_label || `Snapshot ${s.id}`,
              created: s.created
          })).sort((a: ProjectVersion, b: ProjectVersion) => new Date(b.created).getTime() - new Date(a.created).getTime());
      }

      return {
          id: item.id,
          name: item.data.name,
          description: item.data.description || null,
          is_public: item.data.is_public || false,
          owner_id: item.data.owner_id,
          created_at: item.created,
          project_versions: versions
      };
  });

  return {
      items,
      total: res.total,
      pages: Math.ceil(res.total / limit)
  };
}

// ==========================================
// CLIENT-SIDE CALLS
// ==========================================
export async function saveProject(id: string, flatFiles: {path: string, content: string}[]) {
  // We no longer pass the complex 'tree' object.
  // The script will generate the simple path list from 'files'.
  const res = await apex.scripts.run('save-project', {
    project_id: id,
    files: flatFiles
  });
  return res;
}

export async function createProject(name: string, description: string, isPublic: boolean = false) {
  const { initialFileSystem } = await import('./constants');
  
  const flatFiles = flattenTree(initialFileSystem);
  const paths = flatFiles.map(f => f.path);

  const record = await apex.collection('projects').create({
    name,
    description,
    is_public: isPublic,
    tree: paths 
  });

  await apex.scripts.run('save-project', {
    project_id: record.id,
    files: flatFiles,
    version_label: "v1.0 - Initial Commit"
  });

  return { projectId: record.id };
}

function flattenTree(nodes: FileSystemNode[], prefix = ""): {path: string, content: string}[] {
  return nodes.flatMap((n) => {
    const path = prefix ? `${prefix}/${n.name}` : n.name;
    if (n.type === "folder") return flattenTree(n.children || [], path);
    return [{ path, content: n.content || "" }];
  });
}

// =====================================
// Keywords
// =====================================
export async function getKeywords() {
  const res = await apex.collection('keywords').list({
      sort: '-id',
      expand: 'suggestions', // Fetch all suggestions for each keyword
      per_page: 100 // Adjust as needed
  });

  return res.items.map((item: any) => ({
      id: item.id,
      englishTerm: item.data.english_term,
      standardizedSuggestionId: item.data.standardized_suggestion_id,
      // Map expanded suggestions
      suggestions: (item.expand?.suggestions || []).map((s: any) => ({
          id: s.id,
          swahiliTerm: s.data.swahili_term,
          author: s.data.author_name || `User ${s.data.created_by}`,
          description: s.data.description,
          useCaseCode: s.data.use_case_code,
          votes: s.data.votes || 0
      })).sort((a: any, b: any) => b.votes - a.votes)
  }));
}

export async function addKeyword(data: { englishTerm: string, swahiliTerm: string, author: string, description: string, useCaseCode: string }) {
  // 1. Create Keyword
  const keyword = await apex.collection('keywords').create({
      english_term: data.englishTerm
  });

  // 2. Create First Suggestion
  await apex.collection('suggestions').create({
      keyword_id: keyword.id,
      swahili_term: data.swahiliTerm,
      author_name: data.author,
      description: data.description,
      use_case_code: data.useCaseCode,
      votes: 1
  });
  
  return keyword;
}

export async function addSuggestion(keywordId: number, data: any) {
  return await apex.collection('suggestions').create({
      keyword_id: keywordId,
      swahili_term: data.swahiliTerm,
      author_name: data.author,
      description: data.description,
      use_case_code: data.useCaseCode,
      votes: 1
  });
}

export async function voteSuggestion(suggestionId: number, type: 'up' | 'down') {
  // Calls our edge function
  return await apex.scripts.run('vote-suggestion', {
      suggestion_id: suggestionId,
      vote_type: type
  });
}

export async function standardizeSuggestion(keywordId: number, suggestionId: number) {
  return await apex.collection('keywords').update(keywordId, {
      standardized_suggestion_id: suggestionId
  });
}

export async function deleteSuggestion(id: number) {
  return await apex.collection('suggestions').delete(id);
}

export async function updateSuggestion(id: number, data: any) {
   return await apex.collection('suggestions').update(id, {
      swahili_term: data.swahiliTerm,
      description: data.description,
      use_case_code: data.useCaseCode
   });
}

// ==================================
// Docs
// ==================================
export interface DocPage {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  sort_order: number;
  score?: number; // For search results
}

export async function getDocumentationList() {
  // Fetch all docs, sorted by category and then sort_order
  const res = await apex.collection('docs').list({
      sort: 'category,sort_order',
      per_page: 100
  });

  const docs = res.items.map((i: any) => ({
      id: i.id,
      title: i.data.title,
      slug: i.data.slug,
      category: i.data.category,
      content: i.data.content,
      sort_order: i.data.sort_order || 0,
      score: i.score || 0 // Relevance score
  }));

  return docs as DocPage[];
}

export async function getDocBySlug(slug: string) {
  // Since slug might contain slashes (e.g. "getting-started/install"), we filter by it
  // Note: If using deep paths, ensure your slug logic matches.
  
  const res = await apex.collection('docs').list({
      filter: { "slug": slug },
      limit: 1
  });

  if (res.items.length === 0) return null;

  const item = res.items[0];
  return {
      id: item.id,
      title: item.data.title,
      slug: item.data.slug,
      category: item.data.category,
      content: item.data.content,
      sort_order: item.data.sort_order
  } as DocPage;
}

export async function createDoc(data: { title: string, category: string, content: string, sort_order: number }) {
  // The hook will handle the slug
  return await apex.collection('docs').create(data);
}

export async function searchDocs(query: string) {
  if (!query) return getDocumentationList();

  // Use Semantic Vector Search
  const res = await apex.collection('docs').searchRecordsWithOSE(query);
  console.log(res)
  
  return res.map((i: any) => ({
      id: i.id,
      title: i.data.title,
      slug: i.data.slug,
      category: i.data.category,
      content: i.data.content,
      sort_order: i.data.sort_order || 0,
      score: i.score // Relevance score
  } as DocPage));
}

export async function getRelatedDocs(docId: string, title: string) {
  // Search for docs similar to the current title
  const res = await apex.collection('docs').searchTextVector(title, 4);
  
  return res
      .filter((i: any) => i.id !== docId) // Exclude current doc
      .map((i: any) => ({
          id: i.id,
          title: i.data.title,
          slug: i.data.slug,
          category: i.data.category,
          content: (i.data.content+"").substring(0, 150)
      }));
}

// ==================================
// PACKAGES / MODULES
// ==================================
export interface Package {
  id: string;
  name: string;
  slug: string;
  version: string;
  description: string;
  author: string;
  keywords: string[];
  readme: string;
  downloads: number;
  created: string;
  score?: number; // For search relevance
}

/* --- PACKAGES / MODULES --- */

export async function getPackages(page = 1, limit = 12, query = "") {
  // 1. Search Mode (Vector/Semantic)
  if (query) {
      // Note: Vector search currently returns top N matches by relevance.
      // Pagination is less strict here, usually we just return top 20-50.
      const res = await apex.collection('packages').searchRecordsWithOSE(query);
      console.log(res)
      const items = res.map((i) => ({
          id: i.id,
          name: i.data.name,
          slug: i.data.slug,
          version: i.data.version,
          description: i.data.description,
          author: i.data.author,
          keywords: i.data.keywords || [],
          readme: i.data.readme,
          downloads: i.data.downloads || 0,
          created: i.created,
          score: i.score
      }));

      return { items, total: items.length, pages: 1 };
  }

  // 2. Browse Mode (Paginated List)
  const offset = (page - 1) * limit;
  const res = await apex.collection('packages').list({
      sort: '-downloads,-created', // Sort by popularity then new
      limit: limit,
      offset: offset
  });

  const items = res.items.map((i: any) => ({
      id: i.id,
      name: i.data.name,
      slug: i.data.slug,
      version: i.data.version,
      description: i.data.description,
      author: i.data.author,
      keywords: i.data.keywords || [],
      readme: i.data.readme,
      downloads: i.data.downloads || 0,
      created: i.created
  }));

  return { 
      items, 
      total: res.total, 
      pages: Math.ceil(res.total / limit) 
  };
}

export async function getPackageBySlug(slug: string) {
  const res = await apex.collection('packages').list({
      filter: { "slug": slug },
      limit: 1
  });

  if (res.items.length === 0) return null;

  const i = res.items[0];
  return {
      id: i.id,
      name: i.data.name,
      slug: i.data.slug,
      version: i.data.version,
      description: i.data.description,
      author: i.data.author,
      keywords: i.data.keywords || [],
      readme: i.data.readme,
      downloads: i.data.downloads || 0,
      created: i.created
  } as Package;
}

export async function getRelatedPackages(packageId: string, description: string) {
  // Find semantically similar packages
  const res = await apex.collection('packages').searchTextVector(description, 5);
  
  return res
      .filter((i: any) => i.id !== packageId)
      .map((i: any) => ({
          id: i.id,
          name: i.data.name,
          slug: i.data.slug,
          version: i.data.version,
          description: i.data.description,
          author: i.data.author,
          keywords: i.data.keywords || [],
          downloads: i.data.downloads || 0
      }));
}

// ==================================
// NEWS 
// ==================================
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured: boolean;
  published_at: string;
  tags: string[];
}

/* --- NEWS --- */

export async function getNews(page = 1, limit = 9) {
  const offset = (page - 1) * limit;
  
  const res = await apex.collection('news').list({
      sort: '-published_at',
      limit: limit,
      offset: offset
  });

  const items = res.items.map((i: any) => ({
      id: i.id,
      title: i.data.title,
      slug: i.data.slug,
      excerpt: i.data.excerpt,
      content: i.data.content,
      featured: i.data.featured || false,
      published_at: i.data.published_at || i.created,
      tags: i.data.tags || []
  }));

  return { 
      items, 
      total: res.total,
      pages: Math.ceil(res.total / limit)
  };
}

export async function getNewsBySlug(slug: string) {
  const res = await apex.collection('news').list({
      filter: { "slug": slug },
      limit: 1
  });

  if (res.items.length === 0) return null;

  const i = res.items[0];
  return {
      id: i.id,
      title: i.data.title,
      slug: i.data.slug,
      excerpt: i.data.excerpt,
      content: i.data.content,
      featured: i.data.featured || false,
      published_at: i.data.published_at || i.created,
      tags: i.data.tags || []
  } as NewsArticle;
}

// Fetch Featured Article specifically
export async function getFeaturedNews() {
  const res = await apex.collection('news').list({
      filter: { "featured": true },
      limit: 1,
      sort: '-published_at'
  });
  
  if (res.items.length === 0) return null;
  
  const i = res.items[0];
  return {
      id: i.id,
      title: i.data.title,
      slug: i.data.slug,
      excerpt: i.data.excerpt,
      content: i.data.content,
      featured: true,
      published_at: i.data.published_at || i.created,
      tags: i.data.tags || []
  } as NewsArticle;
}

// ==================================
// COMMUNITY 
// ==================================
export interface CommunityLink {
  id: string;
  name: string;
  url: string;
  description: string;
  platform: string;
  category: 'official' | 'unofficial' | 'involved';
}

export async function getCommunityLinks() {
  // Only fetch approved links
  const res = await apex.collection('community_links').list({
      filter: { "approved": true },
      sort: 'category,name',
      per_page: 100
  });

  const items = res.items.map((i: any) => ({
      id: i.id,
      name: i.data.name,
      url: i.data.url,
      description: i.data.description,
      platform: i.data.platform,
      category: i.data.category
  }));

  return items;
}

export async function submitCommunityLink(data: Omit<CommunityLink, 'id' | 'category'>) {
  return await apex.collection('community_links').create({
      ...data,
      category: 'unofficial', // Default to unofficial for user submissions
      approved: false // Requires admin approval
  });
}

// ==================================
// Jobs
// ==================================
export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  application_url: string;
  created: string;
}

export async function getJobs() {
  const res = await apex.collection('jobs').list({
      filter: { "active": true },
      sort: 'department,created',
      per_page: 50
  });

  return res.items.map((i: any) => ({
      id: i.id,
      title: i.data.title,
      department: i.data.department,
      location: i.data.location,
      type: i.data.type,
      description: i.data.description,
      application_url: i.data.application_url,
      created: i.created
  } as Job));
}

// ==================================
// Team Members
// ==================================
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  twitter?: string;
  github?: string;
}

export async function getTeamMembers() {
  const res = await apex.collection('team_members').list({
      sort: 'created',
      per_page: 20
  });

  return res.items.map((i: any) => ({
      id: i.id,
      name: i.data.name,
      role: i.data.role,
      bio: i.data.bio,
      avatar: i.data.avatar ? apex.files.getFileUrl(i.data.avatar) : null,
      twitter: i.data.twitter,
      github: i.data.github
  } as TeamMember));
}

// binary version
export async function getLatestRelease() {
  try {
      const server = await getApexServer();
      const res = await server.scripts.run('get-release-info', {});
      return res as { version: string, date: string };
  } catch (e) {
      return { version: "v1.0.0", date: new Date().toISOString() }; // Fallback
  }
}
