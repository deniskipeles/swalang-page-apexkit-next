"use client";

import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';

export default function SearchBarWrapper({ initialQuery }: { initialQuery: string }) {
    const router = useRouter();

    return (
        <SearchBar 
            onSearch={(q) => {
                if (q !== initialQuery) {
                    router.push(`/modules?q=${encodeURIComponent(q)}`);
                }
            }} 
            isLoading={false} 
        />
    );
}