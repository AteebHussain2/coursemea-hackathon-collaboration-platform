import React, { useState } from 'react';
import { X, Copy, CheckCircle2, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspaceName: string;
    inviteToken: string;
}

const ShareWorkspaceModal: React.FC<ShareWorkspaceModalProps> = ({ isOpen, onClose, workspaceName, inviteToken }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareUrl = `${window.location.origin}/join/${inviteToken}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Invite link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-2">Share Workspace</h2>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Invite others to {workspaceName}</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md rounded-2xl text-gray-400 transition-all active:scale-95">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Anyone with this link will be able to join your workspace as a Member after signing in.
                    </p>

                    <div className="relative group">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="w-full pl-6 pr-16 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-3xl font-bold text-gray-900 dark:text-white focus:outline-none transition-all group-hover:border-indigo-100 dark:group-hover:border-indigo-900/50"
                        />
                        <button
                            onClick={handleCopy}
                            className={`absolute right-3 top-3 bottom-3 px-6 rounded-2xl flex items-center space-x-2 font-bold transition-all active:scale-95 ${copied
                                ? 'bg-green-500 text-white shadow-lg shadow-green-100 dark:shadow-none'
                                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700'
                                }`}
                        >
                            {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/50">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white dark:bg-indigo-900/50 rounded-2xl shadow-sm">
                                <Share2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider mb-1">Collaborative Workspace</h4>
                                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-bold leading-relaxed">
                                    Sharing this link allows teammates to join instantly. You can manage roles and access in the Members list.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-400 font-bold">
                        Secure 256-bit Link
                    </div>
                    <button
                        onClick={onClose}
                        className="py-4 px-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareWorkspaceModal;
