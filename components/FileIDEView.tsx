"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TreeView from '@/components/TreeView';
import Editor from '@/components/Editor';
import Console from '@/components/Console';
import EditorTabs from '@/components/EditorTabs';
import PreviewPane from '@/components/PreviewPane';
import { apex } from '@/lib/apexkit';
import { saveProject } from "@/lib/api";
import type { File, Folder, FileSystemNode, ActiveMobileView } from '@/lib/types';
import { MenuIcon } from '@/components/icons/MenuIcon';
import { SaveIcon } from '@/components/icons/SaveIcon';
import { PreviewIcon } from '@/components/icons/PreviewIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { FilesIcon } from '@/components/icons/FilesIcon';
import { CodeIcon } from '@/components/icons/CodeIcon';
import { TerminalIcon } from '@/components/icons/TerminalIcon';
import { AlertTriangle } from 'lucide-react';

/* --- Helper Functions --- */
const findNodeById = (nodes: FileSystemNode[], id: string): FileSystemNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.type === 'folder') {
            const found = findNodeById(node.children || [], id);
            if (found) return found;
        }
    }
    return null;
};

const findFileById = (nodes: FileSystemNode[], id: string): File | null => {
    const node = findNodeById(nodes, id);
    return node?.type === 'file' ? (node as File) : null;
};

const findParentId = (nodes: FileSystemNode[], childId: string): string | null => {
    for (const node of nodes) {
        if (node.type === 'folder') {
            if ((node.children || []).some(child => child.id === childId)) return node.id;
            const found = findParentId(node.children || [], childId);
            if (found) return found;
        }
    }
    return null;
};

const buildTreeFromSplitList = (apiFiles: { path: string; content: string }[]): FileSystemNode[] => {
    const root: Folder = { id: 'root', name: 'root', type: 'folder', children: [] };
    const map = new Map<string, FileSystemNode>([['', root]]);

    // Sort by path length to ensure folders are created before files
    const sortedFiles = [...apiFiles].sort((a, b) => a.path.split('/').length - b.path.split('/').length);

    sortedFiles.forEach(file => {
        const parts = file.path.split('/');
        let currentPath = '';

        // Create folders
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            const parentPath = currentPath;
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            if (!map.has(currentPath)) {
                const newFolder: Folder = { id: currentPath, name: part, type: 'folder', children: [] };
                map.set(currentPath, newFolder);
                const parent = map.get(parentPath) as Folder;
                if (parent) parent.children.push(newFolder);
            }
        }

        // Create file
        const fileName = parts[parts.length - 1];
        const newFile: File = { id: file.path, name: fileName, type: 'file', content: file.content };
        const parentPath = parts.slice(0, -1).join('/');
        const parent = map.get(parentPath) as Folder;
        if (parent) parent.children.push(newFile);
    });

    return root.children;
};

const flattenFilesForApi = (nodes: FileSystemNode[], contents: Record<string, string>, pathPrefix = ''): { path: string, content: string }[] => {
    return nodes.flatMap(node => {
        const newPath = pathPrefix ? `${pathPrefix}/${node.name}` : node.name;
        if (node.type === 'file') {
            // Use current content from state, or fallback to node content
            return [{ path: newPath, content: contents[node.id] ?? node.content }];
        }
        return flattenFilesForApi(node.children || [], contents, newPath);
    });
};

interface FileIDEViewProps {
    projectId: string;
    initialProject: {
        strategy: string;
        size: number;
        tree: FileSystemNode[];
        files: { path: string; content: string }[];
    };
    activeFilePath: string;
    initialContent: string;
    currentVersion?: string;
}

export default function FileIDEView({ projectId, initialProject, activeFilePath, initialContent, currentVersion }: FileIDEViewProps) {
    const router = useRouter();
    const [isReadOnly] = useState(!!currentVersion);

    // 1. Initialize File System
    const [fileSystem, setFileSystem] = useState<FileSystemNode[]>(() => {
        if (initialProject.files && initialProject.files.length > 0) {
            return buildTreeFromSplitList(initialProject.files);
        } else if (initialProject.tree) {
            return initialProject.tree;
        }
        return [];
    });

    // 2. Initialize File Contents
    const [fileContents, setFileContents] = useState<Record<string, string>>(() => {
        const contents: Record<string, string> = {};
        if (initialProject.files) {
            initialProject.files.forEach(f => {
                contents[f.path] = f.content;
            });
        }
        // Ensure active file content is set
        contents[activeFilePath] = initialContent;
        return contents;
    });

    const [openFileIds, setOpenFileIds] = useState<Set<string>>(new Set([activeFilePath]));
    const [activeFileId, setActiveFileId] = useState<string | null>(activeFilePath);
    const [dirtyFileIds, setDirtyFileIds] = useState<Set<string>>(new Set());
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const [consoleLogs, setConsoleLogs] = useState<string[]>([`File loaded: ${activeFilePath}`]);
    const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);
    const [isPreviewVisible, setPreviewVisible] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [evtSource, setEvtSource] = useState<EventSource | null>(null);
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [activeMobileView, setActiveMobileView] = useState<ActiveMobileView>('editor');

    const openFiles = useMemo(() => [...openFileIds].map(id => findFileById(fileSystem, id)).filter((f): f is File => f !== null), [openFileIds, fileSystem]);
    const activeFile = useMemo(() => activeFileId ? findFileById(fileSystem, activeFileId) : null, [activeFileId, fileSystem]);

    // Ensure readonly prevents editing
    useEffect(() => {
        if (isReadOnly) setIsEditingMode(false);
    }, [isReadOnly]);

    // Cleanup SSE
    useEffect(() => {
        return () => { evtSource?.close(); };
    }, [evtSource]);

    // --- Tree Manipulation Handlers ---

    const handleCreateNode = useCallback((type: 'file' | 'folder') => {
        let parentId: string | null = null;
        if (selectedNodeId) {
            const selectedNode = findNodeById(fileSystem, selectedNodeId);
            if (selectedNode?.type === 'folder') {
                parentId = selectedNode.id;
            } else if (selectedNode?.type === 'file') {
                parentId = findParentId(fileSystem, selectedNode.id);
            }
        }

        // Use path-like ID for new nodes to be consistent, or timestamp for temporary
        const timestamp = Date.now();
        const tempName = type === 'file' ? 'untitled.sw' : 'NewFolder';
        // If adding to root, ID is just name. If parent, parentId/name
        const newId = parentId && parentId !== 'root' ? `${parentId}/${tempName}-${timestamp}` : `${tempName}-${timestamp}`;

        const newNode: FileSystemNode = type === 'file'
            ? { id: newId, name: tempName, type: 'file', content: '' }
            : { id: newId, name: tempName, type: 'folder', children: [] };

        const addNodeToTree = (nodes: FileSystemNode[], pid: string | null, node: FileSystemNode): FileSystemNode[] => {
            if (!pid || pid === 'root') return [...nodes, node];
            return nodes.map(n => {
                if (n.id === pid && n.type === 'folder') {
                    return { ...n, children: [...(n.children || []), node] };
                }
                if (n.type === 'folder') {
                    return { ...n, children: addNodeToTree(n.children || [], pid, node) };
                }
                return n;
            });
        };

        setFileSystem(prev => addNodeToTree(prev, parentId, newNode));
        if (newNode.type === 'file') {
            setFileContents(prev => ({ ...prev, [newId]: '' }));
        }

        setSelectedNodeId(newId);
        setRenamingId(newId); // Trigger input field immediately
    }, [fileSystem, selectedNodeId]);

    const handleRenameNode = useCallback((nodeId: string, newName: string) => {
        const update = (nodes: FileSystemNode[]): FileSystemNode[] => nodes.map(n => {
            if (n.id === nodeId) return { ...n, name: newName.trim() };
            if (n.type === 'folder') return { ...n, children: update(n.children || []) };
            return n;
        });
        setFileSystem(prev => update(prev));
        setRenamingId(null);
    }, []);

    const handleDeleteNode = useCallback((nodeId: string) => {
        if (!window.confirm("Delete this item?")) return;
        const remove = (nodes: FileSystemNode[], id: string): FileSystemNode[] =>
            nodes.filter(n => n.id !== id).map(n => n.type === 'folder' ? { ...n, children: remove(n.children || [], id) } : n);
        setFileSystem(prev => remove(prev, nodeId));
        if (selectedNodeId === nodeId) setSelectedNodeId(null);
    }, [selectedNodeId]);

    const handleCopyNode = useCallback((nodeId: string) => {
        // Implementation for copy (simplified)
        setConsoleLogs(p => [...p, `Copying node ${nodeId} not fully implemented in view.`]);
    }, []);

    // --- File Navigation ---

    const handleFileSelect = useCallback(async (file: File) => {
        // When editing mode is ON, we stay on the page and just switch tabs
        if (isEditingMode && !isReadOnly) {
            if (fileContents[file.id] === undefined) {
                // In split mode, this might be needed if not preloaded
                setFileContents(prev => ({ ...prev, [file.id]: file.content || "" }));
            }
            setOpenFileIds(prev => new Set(prev).add(file.id));
            setActiveFileId(file.id);
            setSelectedNodeId(file.id);
        } else {
            // Navigation mode: Change URL
            const url = currentVersion
                ? `/project/${projectId}/file/${file.id}?version=${currentVersion}`
                : `/project/${projectId}/file/${file.id}`;
            router.push(url);
        }
    }, [isEditingMode, isReadOnly, fileContents, currentVersion, projectId, router]);

    const handleContentChange = useCallback((content: string) => {
        if (activeFileId && !isReadOnly) {
            setFileContents(prev => ({ ...prev, [activeFileId]: content }));
            setDirtyFileIds(prev => new Set(prev).add(activeFileId));
        }
    }, [activeFileId, isReadOnly]);

    // --- Actions ---

    const handleSaveProject = useCallback(async () => {
        setIsSaving(true);
        setConsoleLogs(prev => [...prev, 'Backing up old version and saving changes...']);
        try {
          const filesToSave = flattenFilesForApi(fileSystem, fileContents);
          const res = await saveProject(projectId, filesToSave);
          
          setDirtyFileIds(new Set());
          
          if (res.version_id) {
              setConsoleLogs(prev => [...prev, `Success! Previous version archived (ID: ${res.version_id}).`]);
          } else {
              setConsoleLogs(prev => [...prev, `Success! Project saved.`]);
          }
          
        } catch (e: any) {
          setConsoleLogs(prev => [...prev, `Error saving: ${e.message}`]);
        } finally {
          setIsSaving(false);
        }
    }, [projectId, fileSystem, fileContents]);

    const handleRunCode = useCallback(async () => {
        setIsExecuting(true);
        setConsoleLogs(['Initializing Swalang Runtime...']);

        if (evtSource) evtSource.close();

        const channelId = `run_${Date.now()}`;
        // Using manual SSE construction to avoid SDK cookie issues if any
        const sseUrl = `${apex.baseUrl}/api/v1/sse?channel=${channelId}&event=stdout`;
        const source = new EventSource(sseUrl, { withCredentials: false });

        source.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === "Custom") {
                    const output = msg.payload.data?.raw || msg.payload.data;
                    setConsoleLogs(prev => [...prev, output]);
                }
            } catch (e) {
                console.error(e);
            }
        };

        source.onerror = () => source.close();
        setEvtSource(source);

        try {
            const filesToUpload = flattenFilesForApi(fileSystem, fileContents);
            await apex.scripts.run('run-swalang', {
                files: filesToUpload,
                channel: channelId
            });
        } catch (error: any) {
            setConsoleLogs(prev => [...prev, `Error: ${error.message}`]);
            source.close();
        } finally {
            setIsExecuting(false);
        }
    }, [fileSystem, fileContents, evtSource]);


    const handleMobileFileSelect = useCallback(async (file: File) => {
        await handleFileSelect(file);
        setActiveMobileView('editor');
    }, [handleFileSelect]);

    const MobileNavButton: React.FC<{ view: ActiveMobileView; icon: React.ReactNode; label: string; disabled?: boolean }> = ({ view, icon, label, disabled }) => (
        <button
            onClick={() => setActiveMobileView(view)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs ${activeMobileView === view ? 'text-blue-400' : 'text-gray-400'} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="h-screen w-screen bg-gray-100 dark:bg-gray-800 flex flex-col font-sans">
            {isReadOnly && (
                <div className="bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 flex items-center justify-center text-center py-1.5 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    You are viewing a historical version. Editing is disabled.
                </div>
            )}
            <div className="hidden md:flex flex-1 overflow-hidden">
                <aside className="w-64 bg-gray-50 dark:bg-gray-800 flex flex-col h-full border-r border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold">Explorer</h2>
                        <button
                            onClick={() => setIsEditingMode(!isEditingMode)}
                            disabled={isReadOnly}
                            title={isReadOnly ? "Editing disabled" : (isEditingMode ? "Switch to Navigation Mode" : "Switch to Editing Mode")}
                            className={`p-1 rounded ${isEditingMode ? 'bg-blue-200 dark:bg-blue-800' : ''} hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50`}
                        >
                            <EditIcon />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <TreeView
                            data={fileSystem}
                            onFileSelect={handleFileSelect}
                            activeFileId={activeFileId}
                            renamingId={renamingId}
                            onStartRename={setRenamingId}
                            onCancelRename={() => setRenamingId(null)}
                            onRenameNode={handleRenameNode}
                            onNewFile={() => handleCreateNode('file')}
                            onNewFolder={() => handleCreateNode('folder')}
                            onNodeSelect={setSelectedNodeId}
                            selectedNodeId={selectedNodeId}
                            onDeleteNode={handleDeleteNode}
                            onCopyNode={handleCopyNode}
                            readOnly={isReadOnly}
                        />
                    </div>
                </aside>

                <main className="flex-1 flex flex-col min-w-0 h-full">
                    {/* HEADER WITH SAVE BUTTON */}
                    <header className="flex items-center bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 flex-shrink-0">
                        <button onClick={() => setSidebarVisible(!isSidebarVisible)} className="p-2 hover:bg-gray-300 dark:hover:bg-gray-700"><MenuIcon /></button>
                        <EditorTabs
                            files={openFiles}
                            activeFileId={activeFileId}
                            onTabClick={setActiveFileId}
                            onTabClose={(id) => setOpenFileIds(p => { const n = new Set(p); n.delete(id); return n; })}
                            dirtyFileIds={dirtyFileIds}
                        />
                        <div className="ml-auto pr-2 flex items-center space-x-2">
                            {!isReadOnly && (
                                <button
                                    onClick={handleSaveProject}
                                    disabled={isSaving}
                                    className="p-2 rounded flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500"
                                >
                                    <SaveIcon />
                                    <span className="text-sm font-medium">{isSaving ? 'Saving...' : 'Save'}</span>
                                </button>
                            )}
                            <button onClick={() => setPreviewVisible(!isPreviewVisible)} disabled={!activeFileId} className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50">
                                <PreviewIcon />
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <div className="flex-grow flex">
                            <div className={`h-full ${isPreviewVisible && activeFileId ? 'w-1/2' : 'w-full'}`}>
                                <Editor
                                    fileName={activeFile?.name || ''}
                                    content={activeFileId ? fileContents[activeFileId] ?? null : null}
                                    onContentChange={handleContentChange}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            {isPreviewVisible && activeFileId && (
                                <div className="w-1/2 h-full border-l border-gray-300 dark:border-gray-700">
                                    <PreviewPane fileName={activeFile?.name || ''} content={fileContents[activeFileId]} />
                                </div>
                            )}
                        </div>
                        <div className="h-1/3 max-h-96 border-t border-gray-300 dark:border-gray-700">
                            <Console
                                logs={consoleLogs}
                                onCommand={() => { }}
                                onRun={handleRunCode}
                                onClear={() => setConsoleLogs([])}
                                isExecuting={isExecuting}
                            />
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Layout */}
            <div className="flex md:hidden flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    {activeMobileView === 'explorer' &&
                        <TreeView
                            data={fileSystem}
                            onFileSelect={handleMobileFileSelect}
                            activeFileId={activeFileId}
                            renamingId={null} onStartRename={() => { }} onCancelRename={() => { }}
                            onRenameNode={() => { }} onNewFile={() => { }} onNewFolder={() => { }}
                            onNodeSelect={(id) => {
                                const file = findFileById(fileSystem, id);
                                if (file) handleMobileFileSelect(file);
                            }}
                            selectedNodeId={activeFileId}
                            onDeleteNode={() => { }} onCopyNode={() => { }}
                            readOnly={isReadOnly}
                        />
                    }
                    {activeMobileView === 'editor' &&
                        <Editor
                            fileName={activeFile?.name || ''}
                            content={activeFileId ? fileContents[activeFileId] ?? null : null}
                            onContentChange={(content) => {
                                if (!isReadOnly && activeFileId) {
                                    setFileContents(p => ({ ...p, [activeFileId]: content }))
                                }
                            }}
                            readOnly={isReadOnly}
                        />
                    }
                    {activeMobileView === 'console' &&
                        <Console
                            logs={consoleLogs}
                            onCommand={() => { }}
                            onRun={handleRunCode}
                            onClear={() => setConsoleLogs([])}
                            isExecuting={isExecuting}
                        />
                    }
                </main>
                <nav className="flex items-center bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
                    <MobileNavButton view="explorer" icon={<FilesIcon />} label="Explorer" />
                    <MobileNavButton view="editor" icon={<CodeIcon />} label="Editor" />
                    <MobileNavButton view="console" icon={<TerminalIcon />} label="Console" />
                </nav>
            </div>
        </div>
    );
}