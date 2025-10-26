import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const ClaimForm = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sourceUrl: '',
    category: 'politics',
    tags: '',
    initialEvidence: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'politics', 'health', 'science', 'technology', 
    'entertainment', 'business', 'environment', 'other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to submit a claim');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const claimData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        userId: user.id
      };

      await api.createClaim(claimData);
      navigate('/claims');
    } catch (error) {
      console.error('Failed to submit claim:', error);
      setError('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-4xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-xl text-gray-300 mb-8">
            You need to be logged in to submit claims for fact-checking
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-cyan-500/25 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-400/10 transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/claims')}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            ← Back to Claims
          </button>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Submit Claim
          </h1>
          <p className="text-xl text-gray-300">
            Help fight misinformation by submitting claims for community verification
          </p>
        </motion.div>

        {/* Rest of the form code from the previous SubmitClaimPage.js */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Claim Title */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Claim Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Brief, clear summary of the claim"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
              <p className="text-sm text-gray-400 mt-2">
                Keep it concise and factual
              </p>
            </div>

            {/* Full Claim Content */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Full Claim Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Paste the full text or detailed description of the claim..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors resize-vertical"
              />
            </div>

            {/* Source URL */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Source URL (Optional)
              </label>
              <input
                type="url"
                name="sourceUrl"
                value={formData.sourceUrl}
                onChange={handleChange}
                placeholder="https://example.com/article"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-slate-800">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="vaccine, health, conspiracy"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Initial Evidence */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Initial Evidence/Context (Optional)
              </label>
              <textarea
                name="initialEvidence"
                value={formData.initialEvidence}
                onChange={handleChange}
                rows="4"
                placeholder="Any initial research, counter-evidence, or context..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors resize-vertical"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/claims')}
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-bold text-lg hover:bg-gray-600/20 transition-all flex-1"
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-cyan-500/25 transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Submitting...
                  </div>
                ) : (
                  'Submit for Verification'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ClaimForm;