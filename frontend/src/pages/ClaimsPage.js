import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const ClaimsPage = ({ user }) => {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [categories, setCategories] = useState(['politics', 'health', 'science', 'technology', 'entertainment', 'other']);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      setIsLoading(true);
      const claimsData = await api.getClaims();
      setClaims(claimsData);
    } catch (error) {
      console.error('Failed to load claims');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (claimId, voteType) => {
    if (!user) {
      alert('Please login to vote on claims');
      return;
    }
    
    try {
      await api.voteClaim(claimId, voteType);
      loadClaims(); // Reload to get updated scores
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || claim.category === selectedCategory;
    
    if (filter === 'all') return matchesSearch && matchesCategory;
    if (filter === 'verified') return matchesSearch && matchesCategory && claim.credibilityScore > 70;
    if (filter === 'disputed') return matchesSearch && matchesCategory && claim.credibilityScore < 30;
    if (filter === 'under_review') return matchesSearch && matchesCategory && claim.credibilityScore >= 30 && claim.credibilityScore <= 70;
    
    return matchesSearch && matchesCategory;
  });

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    switch (sortBy) {
      case 'credibility':
        return b.credibilityScore - a.credibilityScore;
      case 'controversial':
        return Math.abs(a.upvotes - a.downvotes) - Math.abs(b.upvotes - b.downvotes);
      case 'discussion':
        return b.discussionCount - a.discussionCount;
      case 'recent':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'from-emerald-500 to-green-500';
      case 'false': return 'from-rose-500 to-red-500';
      case 'misleading': return 'from-amber-500 to-orange-500';
      default: return 'from-cyan-500 to-blue-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified Fact';
      case 'false': return 'False Claim';
      case 'misleading': return 'Misleading';
      default: return 'Under Review';
    }
  };

  const getCredibilityIcon = (score) => {
    if (score > 80) return '🚀';
    if (score > 60) return '⭐';
    if (score > 40) return '👍';
    if (score > 20) return '🤔';
    if (score > 0) return '⚠️';
    return '❌';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
        >
          <div>
            <motion.h1 
              className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              Fact Check Hub
            </motion.h1>
            <p className="text-xl text-gray-300">Collaborate with the community to verify information and fight misinformation</p>
          </div>
          
          {user && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/submit-claim"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all block"
              >
                + Submit Claim
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="🔍 Search claims, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Sort Dropdown */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
              >
                <option value="recent" className="bg-slate-800">Most Recent</option>
                <option value="credibility" className="bg-slate-800">Highest Credibility</option>
                <option value="controversial" className="bg-slate-800">Most Controversial</option>
                <option value="discussion" className="bg-slate-800">Most Discussion</option>
              </select>

              {/* Category Dropdown */}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
              >
                <option value="all" className="bg-slate-800">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap mt-4">
            {['all', 'verified', 'under_review', 'disputed'].map((filterType) => (
              <motion.button
                key={filterType}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-xl font-medium capitalize ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-600'
                }`}
              >
                {filterType.replace('_', ' ')}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Claims Grid */}
        <AnimatePresence>
          {sortedClaims.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-3xl font-bold text-gray-300 mb-4">No claims found</h3>
              <p className="text-gray-400 text-xl mb-8">Try adjusting your search or submit a claim!</p>
              {user && (
                <Link
                  to="/submit-claim"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg"
                >
                  Submit First Claim
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {sortedClaims.map((claim, index) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setSelectedClaim(claim)}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      {/* Category and Status Badges */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs uppercase">
                          {claim.category || 'general'}
                        </span>
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className={`px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(claim.status)} text-white text-sm font-bold`}
                        >
                          {getStatusText(claim.status)}
                        </motion.span>
                      </div>
                      
                      {/* Claim Title and Content */}
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                        {claim.title || claim.content?.substring(0, 100) || claim.text?.substring(0, 100)}
                      </h3>
                      
                      {claim.title && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {claim.content || claim.text}
                        </p>
                      )}
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {claim.tags.map(tag => (
                          <span key={tag} className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Metadata */}
                      <div className="flex items-center text-sm text-gray-400 gap-4 flex-wrap">
                        <span>By {claim.username}</span>
                        <span>•</span>
                        <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>💬 {claim.discussionCount || 0}</span>
                        <span>•</span>
                        <span>📚 {claim.evidenceCount || 0} sources</span>
                      </div>
                    </div>
                    
                    {/* Credibility Score */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-lg">{getCredibilityIcon(claim.credibilityScore)}</span>
                        <div className={`text-2xl font-bold ${
                          claim.credibilityScore > 70 ? 'text-emerald-400' : 
                          claim.credibilityScore > 30 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {claim.credibilityScore}%
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">Community Score</div>
                    </div>
                  </div>
                  
                  {/* Voting and Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(claim.id, 'up');
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors"
                      >
                        👍 {claim.upvotes}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(claim.id, 'down');
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-rose-500/20 text-rose-300 rounded-lg text-sm hover:bg-rose-500/30 transition-colors"
                      >
                        👎 {claim.downvotes}
                      </motion.button>
                    </div>
                    
                    {/* AI Moderation Flag */}
                    {claim.aiModeration?.flag !== 'none' && (
                      <div className="flex items-center gap-1 text-amber-400 text-sm bg-amber-500/10 px-2 py-1 rounded-lg">
                        <span>🤖</span>
                        <span>AI Review</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Claims', value: claims.length, emoji: '📊' },
                { label: 'Verified Facts', value: claims.filter(c => c.status === 'verified').length, emoji: '✅' },
                { label: 'Under Review', value: claims.filter(c => c.status === 'under_review').length, emoji: '⏳' },
                { label: 'Active Fact-Checkers', value: '1.2K+', emoji: '👥' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4"
                >
                  <div className="text-2xl mb-2">{stat.emoji}</div>
                  <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Claim Detail Modal */}
      <AnimatePresence>
        {selectedClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedClaim(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Claim Analysis</h2>
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm uppercase">
                      {selectedClaim.category || 'general'}
                    </span>
                    <motion.span
                      className={`px-4 py-1 rounded-full bg-gradient-to-r ${getStatusColor(selectedClaim.status)} text-white font-bold`}
                    >
                      {getStatusText(selectedClaim.status)}
                    </motion.span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedClaim(null)}
                  className="w-8 h-8 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-300 hover:bg-rose-500/30 transition-colors"
                >
                  ×
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Claim Content */}
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Claim</h3>
                  <p className="text-white leading-relaxed text-lg">{selectedClaim.content || selectedClaim.text}</p>
                </div>

                {/* Credibility Score */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-white">Community Verdict</h4>
                      <p className="text-gray-400 text-sm">Based on {selectedClaim.upvotes + selectedClaim.downvotes} votes</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCredibilityIcon(selectedClaim.credibilityScore)}</span>
                        <div className={`text-3xl font-bold ${
                          selectedClaim.credibilityScore > 70 ? 'text-emerald-400' : 
                          selectedClaim.credibilityScore > 30 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {selectedClaim.credibilityScore}%
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">Credibility Score</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClaim.tags.map(tag => (
                      <span key={tag} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400">Submitted By</div>
                    <div className="text-white font-medium">{selectedClaim.username}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400">Date Submitted</div>
                    <div className="text-white font-medium">{new Date(selectedClaim.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400">Evidence Submitted</div>
                    <div className="text-white font-medium">{selectedClaim.evidenceCount || 0} sources</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400">Community Discussion</div>
                    <div className="text-white font-medium">{selectedClaim.discussionCount || 0} comments</div>
                  </div>
                </div>

                {/* Voting Stats */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-3">Community Votes</h4>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-2xl text-emerald-400 font-bold">{selectedClaim.upvotes}</div>
                      <div className="text-gray-400 text-sm">Credible Votes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-rose-400 font-bold">{selectedClaim.downvotes}</div>
                      <div className="text-gray-400 text-sm">False Votes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-amber-400 font-bold">{selectedClaim.upvotes + selectedClaim.downvotes}</div>
                      <div className="text-gray-400 text-sm">Total Votes</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
                    <Link
                      to={`/claims/${selectedClaim.id}`}
                      className="block w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 rounded-xl font-bold text-center hover:shadow-cyan-500/25 transition-all"
                    >
                      View Full Analysis & Evidence
                    </Link>
                  </motion.div>
                  {user && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVote(selectedClaim.id, 'up')}
                      className="px-6 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold hover:bg-emerald-500/30 transition-colors"
                    >
                      Vote Credible
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClaimsPage;