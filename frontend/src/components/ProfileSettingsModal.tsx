import React, { useState } from 'react';
import { X, Camera, Save, User as UserIcon, AtSign } from 'lucide-react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose }) => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen || !user) return null;

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setIsUploading(true);
            const res = await api.post('/users/profile/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setAvatarUrl(res.data.data);
                toast.success('Avatar uploaded!');
            }
        } catch (error) {
            toast.error('Failed to upload avatar');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const res = await userService.updateProfile({ name, bio, avatarUrl });
            if (res.success) {
                setUser(res.data);
                toast.success('Profile updated!');
                onClose();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-linear-to-r from-gray-50 to-white">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 leading-none mb-2">Profile Settings</h2>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Customize your presence</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-md rounded-2xl text-gray-400 transition-all active:scale-95">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-4xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-200 overflow-hidden border-4 border-white">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                                ) : (
                                    <span>{name.charAt(0).toUpperCase()}</span>
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-3 bg-white text-indigo-600 rounded-2xl shadow-xl border border-gray-50 hover:scale-110 active:scale-95 cursor-pointer transition-all">
                                <Camera className="h-5 w-5" />
                                <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center">
                                <UserIcon className="h-3 w-3 mr-1" /> Display Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                                placeholder="Your full name"
                            />
                        </div>

                        {/* Bio Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center">
                                <AtSign className="h-3 w-3 mr-1" /> Short Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all resize-none h-24"
                                placeholder="Tell the team a bit about yourself..."
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 flex items-center space-x-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 px-6 bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all border border-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isUploading}
                        className="flex-2 py-4 px-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center space-x-2 active:scale-95"
                    >
                        {isSaving ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsModal;
