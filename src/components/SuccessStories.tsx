import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';

export interface UserReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  userAvatar?: string;
}

const LOCAL_STORAGE_KEY = 'cvpilot_real_user_reviews_v2';

export const SuccessStories: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<UserReview[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_e) {
      // Fallback
    }
    return [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Thank you! Your review and rating have been posted.');
  
  // Form State
  const [formName, setFormName] = useState(user?.displayName || '');
  const [formRole, setFormRole] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formComment, setFormComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Sync user display name if user logs in later
  useEffect(() => {
    if (user?.displayName && !formName) {
      setFormName(user.displayName);
    }
  }, [user]);

  // Load reviews from Firestore cloud on mount
  useEffect(() => {
    const fetchCloudReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), orderBy('date', 'desc'), limit(30));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const cloudList: UserReview[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudList.push({
              id: docSnap.id,
              name: data.name || 'Anonymous User',
              role: data.role || 'Job Seeker',
              rating: Number(data.rating) || 5,
              comment: data.comment || '',
              date: data.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              verified: true,
            });
          });

          if (cloudList.length > 0) {
            setReviews(prev => {
              const combined = [...cloudList, ...prev.filter(p => !cloudList.some(c => c.id === p.id))];
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combined));
              return combined;
            });
          }
        }
      } catch (err) {
        console.warn('Firestore reviews fetch notice:', err);
      }
    };

    fetchCloudReviews();
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    setIsSubmitting(true);
    const newReview: UserReview = {
      id: 'rev_' + Date.now(),
      name: formName.trim(),
      role: formRole.trim() || 'Job Seeker',
      rating: formRating,
      comment: formComment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verified: true,
      userAvatar: user?.photoURL || undefined
    };

    // 1. Update local state & localStorage instantly
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // 2. Async sync with Firestore
    try {
      await addDoc(collection(db, 'reviews'), {
        name: newReview.name,
        role: newReview.role,
        rating: newReview.rating,
        comment: newReview.comment,
        date: newReview.date,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore review save notice:', err);
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormComment('');
    setFormRole('');
    setToastMessage('Thank you! Your review and rating have been posted.');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this review?')) return;

    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    try {
      if (!id.startsWith('rev_')) {
        await deleteDoc(doc(db, 'reviews', id));
      }
    } catch (err) {
      console.warn('Firestore review delete notice:', err);
    }

    setToastMessage('Review removed successfully.');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto font-sans transition-colors duration-300 relative">
      
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-bounce">
          <span className="material-symbols-outlined text-lg">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-outline-variant dark:border-slate-800 pb-8">
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-black text-navy dark:text-white tracking-tight">
            User Reviews & Ratings
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Read real feedback from job seekers and share your own rating about your experience with <span className="font-bold text-navy dark:text-gold">CV PILOT</span>.
          </p>
        </div>

        {/* Action Button & Rating Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="text-2xl font-black text-amber-500">{avgRating}</div>
            <div>
              <div className="flex text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {reviews.length} {reviews.length === 1 ? 'User Review' : 'User Reviews'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gold hover:bg-[#8e6f3d] text-navy font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-gold"
          >
            <span className="material-symbols-outlined text-base">rate_review</span>
            Write a Review
          </button>
        </div>
      </div>

      {/* Reviews Grid or Empty State */}
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-3xl">
            <span className="material-symbols-outlined">rate_review</span>
          </div>
          <h3 className="text-xl font-bold text-navy dark:text-white">
            No User Reviews Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Be the first user to share your rating and review for CV PILOT! Your feedback helps other job seekers.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-navy dark:bg-gold text-white dark:text-navy font-bold text-xs rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Write the First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 hover:border-gold dark:hover:border-gold p-6 rounded-2xl shadow-xs transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* User Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {rev.userAvatar ? (
                      <img 
                        src={rev.userAvatar} 
                        alt={rev.name} 
                        className="w-10 h-10 rounded-full object-cover border border-gold/40 shadow-xs"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gold/20 text-gold font-extrabold flex items-center justify-center text-sm border border-gold/30">
                        {rev.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-navy dark:text-white flex items-center gap-1.5">
                        {rev.name}
                        {rev.verified && (
                          <span className="material-symbols-outlined text-xs text-blue-500" title="Verified Reviewer">verified</span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {rev.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {rev.date}
                    </span>
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      title="Remove review"
                      aria-label="Remove review"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {'★'.repeat(rev.rating)}
                  {'☆'.repeat(5 - rev.rating)}
                </div>

                {/* Review Comment */}
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  Verified Review
                </span>
                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  className="text-rose-500 hover:underline text-[11px] font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-xs">delete</span>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Write a Review */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 my-auto">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-navy dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">rate_review</span>
                Leave a Review & Rating
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              
              {/* Star Rating Selector */}
              <div className="space-y-1.5 text-center bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 tracking-wider">
                  Your Overall Rating
                </label>
                <div className="flex justify-center items-center gap-2 text-3xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setFormRating(star)}
                      className="text-amber-400 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                    >
                      {star <= (hoverRating ?? formRating) ? '★' : '☆'}
                    </button>
                  ))}
                </div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {formRating} out of 5 Stars
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Role Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Your Job Title or Profession
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer, Marketing Specialist"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Your Review / Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your experience building your CV or landing job interviews with CV PILOT..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gold hover:bg-[#8e6f3d] text-navy font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer border border-gold disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  {isSubmitting ? 'Posting...' : 'Submit Review'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
