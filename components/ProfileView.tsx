import React, { useState, useEffect, useRef } from 'react';
import { LeaderboardUser } from '../types';
import Spinner from './Spinner';

// --- Icon Components ---
const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);
const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M15.312 3.312a.75.75 0 01.442 1.352l-2.22 1.11A4.5 4.5 0 0110 9.752a4.5 4.5 0 01-3.534-3.978l-2.22-1.11a.75.75 0 01.442-1.352l2.22 1.11a2.989 2.989 0 006.664 0l2.22-1.11zM10 11.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
        <path d="M4.534 8.212a3 3 0 015.932 0l.613.307a.75.75 0 010 1.35l-1.075.537a.75.75 0 01-.82-.123l-.768-.922a.75.75 0 00-1.12.16l-.768.922a.75.75 0 01-.82.123l-1.075-.537a.75.75 0 010-1.35l.613-.307zM2 13.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM5.5 15.25a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6.25a.75.75 0 01-.75-.75z" />
    </svg>
);
const SignOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
    </svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);


interface ProfileViewProps {
  profileData: LeaderboardUser;
  isCurrentUser: boolean;
  rank: number | null;
  onSignOut: () => void;
  onBack?: () => void;
  onUpdateProfile?: (data: { displayName: string, nickname: string }) => Promise<void>;
  onPhotoUpload?: (file: File) => Promise<void>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profileData, isCurrentUser, rank, onSignOut, onBack, onUpdateProfile, onPhotoUpload }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(profileData.displayName || '');
    const [nickname, setNickname] = useState(profileData.nickname || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        setDisplayName(profileData.displayName || '');
        setNickname(profileData.nickname || '');
    }, [profileData]);

    const handleSave = async () => {
        if (onUpdateProfile) {
            setIsSaving(true);
            await onUpdateProfile({ displayName, nickname });
            setIsSaving(false);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setDisplayName(profileData.displayName || '');
        setNickname(profileData.nickname || '');
        setIsEditing(false);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onPhotoUpload) {
            setIsUploading(true);
            try {
                await onPhotoUpload(file);
            } catch (error) {
                alert("Photo upload failed. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const nameToDisplay = profileData.displayName || profileData.nickname || profileData.email;
    const avatarUrl = profileData.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${nameToDisplay}`;

    return (
        <div className="p-4 pb-20 flex flex-col items-center relative h-full">
            {onBack && (
                <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-700 transition-colors z-10">
                    <BackArrowIcon />
                </button>
            )}
            <div className="w-full flex justify-center absolute top-4">
                <h2 className="text-xl font-bold text-slate-100">
                    {isCurrentUser ? 'আমার প্রোফাইল' : 'ব্যবহারকারীর প্রোফাইল'}
                </h2>
            </div>

            <div className="flex flex-col items-center mt-20 text-center">
                <div className="relative group">
                    <img
                        className="w-24 h-24 rounded-full ring-4 ring-slate-600 object-cover"
                        src={avatarUrl}
                        alt="User Profile"
                    />
                    {isCurrentUser && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            disabled={isUploading}
                        >
                            {isUploading ? <Spinner /> : <CameraIcon />}
                        </button>
                    )}
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
                {!isEditing ? (
                    <>
                        <h2 className="text-2xl font-bold text-slate-100 mt-4">{profileData.displayName || 'Display Name'}</h2>
                        <p className="text-md text-slate-400">@{profileData.nickname || 'nickname'}</p>
                        <p className="text-sm text-slate-500 mt-1">{profileData.email}</p>
                    </>
                ) : (
                    <div className="w-full max-w-xs mt-4 space-y-3">
                         <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-slate-400 text-left mb-1">Display Name</label>
                            <input
                                id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                                className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Your full name"
                            />
                        </div>
                         <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-slate-400 text-left mb-1">Nickname</label>
                            <input
                                id="nickname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                                className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="A short nickname"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8">
                <div className="flex flex-col items-center justify-center bg-slate-800 p-6 rounded-2xl">
                    <StarIcon />
                    <p className="text-sm text-slate-400 mt-2">Total XP</p>
                    <p className="text-2xl font-bold text-white">{profileData.xp}</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-800 p-6 rounded-2xl">
                    <TrophyIcon />
                    <p className="text-sm text-slate-400 mt-2">Leaderboard Rank</p>
                    <p className="text-2xl font-bold text-white">{rank ? `#${rank}` : 'Unranked'}</p>
                </div>
            </div>
            
            {isCurrentUser && (
                <div className="w-full max-w-sm mt-8 space-y-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full flex items-center justify-center bg-blue-600/80 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <EditIcon />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button onClick={handleCancel} className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700">Cancel</button>
                            <button onClick={handleSave} disabled={isSaving} className="w-full flex justify-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-800 disabled:cursor-wait">
                                {isSaving ? <Spinner /> : 'Save Changes'}
                            </button>
                        </div>
                    )}
                    <button
                        onClick={onSignOut}
                        className="w-full flex items-center justify-center bg-red-600/20 text-red-400 font-bold py-3 px-4 rounded-lg hover:bg-red-600/30 transition-colors"
                    >
                        <SignOutIcon />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileView;
