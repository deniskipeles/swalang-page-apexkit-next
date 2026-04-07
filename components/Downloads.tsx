"use client";

import React, { useEffect, useState } from 'react';
import AppleIcon from './icons/AppleIcon';
import WindowsIcon from './icons/WindowsIcon';
import LinuxIcon from './icons/LinuxIcon';
import { apex } from '@/lib/apexkit';

const DownloadCard: React.FC<{
    icon: React.ReactNode;
    os: string;
    children: React.ReactNode;
    primaryText: string;
    onClick: () => void;
    isLoading: boolean;
}> = ({ icon, os, children, primaryText, onClick, isLoading }) => (
    <div className="bg-white dark:bg-swa-gray p-8 border-t-4 border-swa-green shadow-lg hover:shadow-2xl hover:shadow-swa-green/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-2xl font-bold ml-3 text-gray-900 dark:text-white">{os}</h3>
        </div>
        <div className="flex-grow text-gray-600 dark:text-swa-light-gray mb-6">
            {children}
        </div>
        <button 
            onClick={onClick}
            disabled={isLoading}
            className="w-full text-center bg-swa-green text-swa-dark font-bold py-3 px-6 rounded-md hover:bg-opacity-80 transition-colors shadow-md shadow-swa-green/20 disabled:opacity-50 disabled:cursor-wait"
        >
            {isLoading ? "Fetching URL..." : primaryText}
        </button>
    </div>
);

const Checksum: React.FC<{ label: string; hash: string }> = ({ label, hash }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-swa-gray last:border-b-0 flex-wrap gap-2">
        <span className="font-semibold text-gray-700 dark:text-gray-300 mr-4">{label}</span>
        <div className="flex-1 min-w-0">
             <code className="block w-full text-sm text-gray-500 dark:text-swa-light-gray bg-gray-100 dark:bg-swa-dark px-2 py-1 rounded break-all">
                {hash}
            </code>
        </div>
    </div>
)

const Downloads: React.FC = () => {
    const [release, setRelease] = useState<{version: string, date: string, checksums: string} | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloadingOS, setDownloadingOS] = useState<string | null>(null);

    useEffect(() => {
        // Fetch release info from the Edge Function
        apex.scripts.run('get-release-info', {})
            .then((data: any) => {
                setRelease(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch release info", err);
                setLoading(false);
            });
    }, []);

    const handleDownload = async (os: string) => {
        setDownloadingOS(os);
        try {
            // Request a signed S3 URL from the Edge Function
            const res = await apex.scripts.run('get-latest-binary', { os });
            
            if (res.success && res.downloadUrl) {
                // Trigger download
                window.location.href = res.downloadUrl;
            } else {
                alert("Download not available: " + (res.error || "Unknown error"));
            }
        } catch (e: any) {
            console.error(e);
            alert("Failed to initiate download. Please try again later.");
        } finally {
            setDownloadingOS(null);
        }
    };

    // Helper to find checksum in the raw text file
    const getHashForPattern = (pattern: string) => {
        if (!release?.checksums) return "Loading...";
        
        const lines = release.checksums.split('\n');
        for (const line of lines) {
            if (line.toLowerCase().includes(pattern.toLowerCase())) {
                // Sha256sum output format: HASH  filename
                return line.trim().split(/\s+/)[0]; 
            }
        }
        return "Pending build...";
    };

    const version = release?.version || "Loading...";
    const date = release?.date ? new Date(release.date).toLocaleDateString() : "...";

    return (
        <div className="bg-gray-50 dark:bg-swa-dark">
            <div className="container mx-auto px-4 py-16">
                <header className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Download Swalang</h1>
                    <p className="text-xl text-gray-600 dark:text-swa-light-gray max-w-3xl mx-auto">
                        Get the latest version of Swalang for your system. Current version: <span className="font-bold text-swa-green">{version}</span> ({date})
                    </p>
                </header>

                <main>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <DownloadCard
                            icon={<AppleIcon className="h-8 w-8 text-gray-800 dark:text-white" />}
                            os="macOS"
                            primaryText="Download for macOS"
                            isLoading={downloadingOS === 'macos'}
                            onClick={() => handleDownload('macos')}
                        >
                            <p>Universal binary for both Apple Silicon and Intel-based Macs.</p>
                            <div className="mt-4 text-xs text-gray-400">
                                Supports macOS 11 (Big Sur) or newer.
                            </div>
                        </DownloadCard>
                        
                        <DownloadCard
                             icon={<WindowsIcon className="h-8 w-8 text-gray-800 dark:text-white" />}
                             os="Windows"
                             primaryText="Download for Windows"
                             isLoading={downloadingOS === 'windows'}
                             onClick={() => handleDownload('windows')}
                        >
                            <p>Installer for 64-bit systems.</p>
                             <div className="mt-4 text-xs text-gray-400">
                                Requires Windows 10 or newer.
                            </div>
                        </DownloadCard>
                        
                        <DownloadCard
                             icon={<LinuxIcon className="h-8 w-8 text-gray-800 dark:text-white" />}
                             os="Linux"
                             primaryText="Download for Linux"
                             isLoading={downloadingOS === 'linux'}
                             onClick={() => handleDownload('linux')}
                        >
                            <p>Binaries for 64-bit Linux distributions (musl).</p>
                            <div className="mt-4 text-xs text-gray-400">
                                Static binary, no dependencies required.
                            </div>
                        </DownloadCard>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Verify Your Download</h2>
                        <p className="text-center text-gray-600 dark:text-swa-light-gray mb-8">
                            SHA-256 checksums for the current release.
                        </p>
                        
                        <div className="bg-white dark:bg-swa-gray p-6 rounded-lg shadow-md mb-12">
                            {loading ? (
                                <div className="text-center py-4 text-gray-500 animate-pulse">Fetching checksums...</div>
                            ) : (
                                <>
                                    <Checksum label="macOS (apple-darwin)" hash={getHashForPattern("apple-darwin")} />
                                    <Checksum label="Windows (.exe)" hash={getHashForPattern(".exe")} />
                                    <Checksum label="Linux (linux-musl)" hash={getHashForPattern("linux-musl")} />
                                </>
                            )}
                        </div>

                         <div className="text-center">
                            <a href={`https://github.com/deniskipeles/swalang/releases/tag/${version}`} target="_blank" rel="noreferrer" className="text-swa-green hover:underline font-semibold">
                                View Full Release Notes on GitHub
                            </a>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Downloads;