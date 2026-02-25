import React, { useState, useEffect, useRef } from 'react';
import {
  User, Lock, Camera, Mail, Shield, Save, Loader2, Trash2, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Services & Context
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateUser } = useAuth(); // Get user and the update function we made earlier
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- STATE: General Form ---
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '', // Read only usually
    bio: user?.bio || '',     // Add 'bio' to your backend model if you want
    title: user?.title || ''  // e.g. "Software Engineer"
  });

  // --- STATE: Password Form ---
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 1. Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await userService.updateProfile({
        full_name: formData.full_name,
        bio: formData.bio,
        title: formData.title
      });

      // Update Local Storage & Context instantly
      updateUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      await userService.changePassword(passData.currentPassword, passData.newPassword);
      toast.success("Password changed! Please login again.");
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Avatar Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview instantly (Optional)
    const objectUrl = URL.createObjectURL(file);

    // Optimistic UI update (shows image before upload finishes)
    // You might want to wait for server response in a real app

    const toastId = toast.loading("Uploading image...");

    try {
      const data = await userService.uploadAvatar(file);
      updateUser({ image: data.image_url }); // Expecting backend to return { image_url: "..." }
      toast.success("Avatar updated!", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Image upload failed.", { id: toastId });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">

      {/* --- HEADER SECTION --- */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-8">

        {/* Avatar Area */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full p-1 bg-linear-to-tr from-purple-500 to-pink-500">
            <img
              src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt="avatar"
              className="w-full h-full rounded-full bg-white object-cover border-4 border-white"
            />
          </div>
          {/* Camera Icon Overlay */}
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors shadow-lg"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        {/* Text Info */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.full_name}</h1>
          <p className="text-gray-500 mb-4">{user?.title || "Student Developer"} • {user?.email}</p>

          <div className="flex justify-center md:justify-start gap-4">
            <div className="bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 text-center">
              <span className="block text-xl font-bold text-purple-600">{user?.xp || 0}</span>
              <span className="text-xs text-purple-400 font-bold uppercase">Total XP</span>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100 text-center">
              <span className="block text-xl font-bold text-red-600">{user?.current_streak || 0}</span>
              <span className="text-xs text-red-400 font-bold uppercase">Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Sidebar: Tabs */}
        <div className="lg:col-span-1">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'general'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
            >
              <User className="w-5 h-5" />
              General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'security'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
            >
              <Shield className="w-5 h-5" />
              Security
            </button>
          </nav>
        </div>

        {/* Right Content: Forms */}
        <div className="lg:col-span-3">

          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Details</h2>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none font-medium text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Title / Role</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Frontend Developer"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none font-medium text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed font-medium"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">To change your email, please contact support.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                  <textarea
                    rows="4"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us a bit about yourself..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none font-medium text-gray-800 resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 transition-all active:scale-95 flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Password Change Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={passData.currentPassword}
                        onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          value={passData.newPassword}
                          onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                          className="w-full pl-12 px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />

                        <input

                          type="password"
                          value={passData.confirmPassword}
                          onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                          className="w-full pl-12 px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700">Delete Account</h3>
                    <p className="text-red-600/70 text-sm mt-1 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;