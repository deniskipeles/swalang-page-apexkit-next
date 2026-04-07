"use client";

import { useState } from 'react';
import CheckIcon from '@/components/icons/CheckCircleIcon';
import { CopyIcon } from 'lucide-react';

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button onClick={handleCopy} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" aria-label="Copy">
            {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CopyIcon className="h-5 w-5 text-gray-500" />}
        </button>
    );
}