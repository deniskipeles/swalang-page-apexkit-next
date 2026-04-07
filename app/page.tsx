import HomeUI from "@/components/HomeUI";
import { getLatestRelease, getNews, getPackages } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data in parallel for speed
  const [release, newsData, packagesData] = await Promise.all([
    getLatestRelease(),
    getNews(1, 3), // Get top 3 news articles
    getPackages(1, 4, "") // Get top 4 most downloaded packages
  ]);

  return (
    <HomeUI 
        latestVersion={release.version}
        latestNews={newsData.items}
        popularPackages={packagesData.items}
    />
  );
}