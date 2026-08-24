import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMembership } from '../../context/MembershipContext';
import { useResumes } from '../../context/ResumeContext';
import { ThemeToggle } from '../ThemeToggle';

export const SettingsView: React.FC = () => {
  const { user, setUserSession, logout } = useAuth();
  const { isProMember, openUpgradeModal, downgradeToFree } = useMembership();
  const { resumes } = useResumes();

  const [displayName, setDisplayName] = useState<string>(user?.displayName || '');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedSession = { ...user, displayName: displayName.trim() || user.email?.split('@')[0] || 'User' };
      setUserSession(updatedSession);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleExportAllData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cvpilot_resumes_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-xl animate-fadeIn max-w-5xl">
      {/* Header Banner */}
      <div className="pb-md border-b border-outline-variant dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-gold text-2xl">settings</span>
          <h1 className="font-display text-h1-mobile md:text-h1 font-bold text-navy dark:text-white">
            Account & Application Settings
          </h1>
        </div>
        <p className="font-sans text-body-md text-navy dark:text-slate-300 opacity-80">
          Manage your personal profile, subscription status, notification preferences, and data security.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          Profile settings saved successfully!
        </div>
      )}

      {/* Grid Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Left Column: Navigation / Quick User Card */}
        <div className="space-y-md">
          {/* User Profile Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 p-lg rounded-2xl shadow-xs text-center space-y-md">
            <div className="w-20 h-20 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-2xl mx-auto border-2 border-gold shadow-sm">
              {displayName.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="font-display text-h3 text-navy dark:text-white font-bold">{displayName}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user?.email}</p>
            </div>
            <div className="flex justify-center gap-2">
              <span className={`px-3 py-1 text-xs font-extrabold rounded-full uppercase tracking-wider ${
                isProMember 
                  ? 'bg-amber-500/10 text-gold border border-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}>
                {isProMember ? 'PRO Member ($5/mo)' : 'Basic Free Plan'}
              </span>
            </div>
            <div className="pt-sm border-t border-outline-variant dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Active CVs: <strong className="text-navy dark:text-white">{resumes.length}</strong>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 p-md rounded-2xl shadow-xs space-y-2">
            <button
              onClick={handleExportAllData}
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-navy dark:text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-base text-gold">download_for_offline</span>
              Backup All Resumes (JSON)
            </button>

            <button
              onClick={logout}
              className="w-full py-2.5 px-3 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 border border-rose-200 dark:border-rose-900"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Sign Out of Account
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Forms & Options */}
        <div className="md:col-span-2 space-y-lg">
          {/* Section 1: Profile Information */}
          <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 p-lg rounded-2xl shadow-xs space-y-md">
            <h2 className="font-display text-h3 text-navy dark:text-white font-bold pb-sm border-b border-outline-variant dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-gold">person</span>
              Profile Details
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-navy dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Account Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-sm font-mono cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Email address is linked to your authentication provider.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-navy dark:bg-gold text-white dark:text-navy font-bold text-xs rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wider"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Section 2: Membership & Subscription */}
          <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 p-lg rounded-2xl shadow-xs space-y-md">
            <h2 className="font-display text-h3 text-navy dark:text-white font-bold pb-sm border-b border-outline-variant dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-gold">workspace_premium</span>
              Membership & Billing
            </h2>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-navy dark:text-white">
                    {isProMember ? 'PRO Membership ($5.00/month)' : 'Basic Free Tier'}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded ${
                    isProMember ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {isProMember ? 'ACTIVE' : 'FREE'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isProMember
                    ? 'Unlimited CV creations, 100+ premium templates & priority AI generation.'
                    : 'Limited to 1 active CV. Upgrade to unlock all 100+ templates & unlimited exports.'}
                </p>
              </div>

              {!isProMember ? (
                <button
                  onClick={openUpgradeModal}
                  className="px-4 py-2.5 bg-gold hover:bg-[#8e6f3d] text-navy font-bold text-xs rounded-xl transition-colors whitespace-nowrap uppercase tracking-wider"
                >
                  Upgrade to Pro ($5/mo)
                </button>
              ) : (
                <button
                  onClick={() => setShowDowngradeConfirm(!showDowngradeConfirm)}
                  className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors whitespace-nowrap"
                >
                  Manage Membership
                </button>
              )}
            </div>

            {showDowngradeConfirm && isProMember && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl space-y-3 animate-fadeIn">
                <p className="text-xs font-bold text-rose-800 dark:text-rose-300">
                  Are you sure you want to cancel your Pro membership?
                </p>
                <p className="text-[11px] text-rose-700 dark:text-rose-400">
                  You will lose access to premium templates and unlimited CV creation at the end of your billing cycle.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      downgradeToFree();
                      setShowDowngradeConfirm(false);
                    }}
                    className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Confirm Downgrade
                  </button>
                  <button
                    onClick={() => setShowDowngradeConfirm(false)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Keep Pro Status
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: App Preferences & Theme */}
          <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 p-lg rounded-2xl shadow-xs space-y-md">
            <h2 className="font-display text-h3 text-navy dark:text-white font-bold pb-sm border-b border-outline-variant dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-gold">tune</span>
              App Preferences
            </h2>

            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              {/* Theme Toggle */}
              <div className="pt-2 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-navy dark:text-white">Interface Theme</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark visual themes</p>
                </div>
                <ThemeToggle showLabel />
              </div>

              {/* Default Export Format */}
              <div className="pt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-navy dark:text-white">Default Export Format</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Preferred file format when downloading CVs</p>
                </div>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="pdf">PDF (High-Res Vector)</option>
                  <option value="docx">DOCX (Editable Word)</option>
                  <option value="txt">Plain Text (ATS Clean)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section 4: Security & Danger Zone */}
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950 p-lg rounded-2xl shadow-xs space-y-md">
            <h2 className="font-display text-h3 text-rose-600 dark:text-rose-400 font-bold pb-sm border-b border-rose-100 dark:border-rose-950 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">security</span>
              Account Security & Privacy
            </h2>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-navy dark:text-white">Account Data Backup</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Download a full JSON copy of all your stored resume data</p>
              </div>
              <button
                onClick={handleExportAllData}
                className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-navy dark:text-white font-bold text-xs rounded-xl transition-colors"
              >
                Export JSON
              </button>
            </div>

            <div className="pt-md border-t border-rose-100 dark:border-rose-950 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">Delete Account</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Permanently delete your CV PILOT account and all active resume data</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
              >
                Delete Account
              </button>
            </div>

            {showDeleteConfirm && (
              <div className="p-4 bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 rounded-xl space-y-3 animate-fadeIn">
                <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                  ⚠️ Warning: Account deletion is permanent and cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowDeleteConfirm(false);
                    }}
                    className="px-3.5 py-2 bg-rose-700 text-white font-bold text-xs rounded-lg hover:bg-rose-800 transition-colors uppercase"
                  >
                    Permanently Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
