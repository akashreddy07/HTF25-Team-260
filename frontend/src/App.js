import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Sample Claims Data
const sampleClaims = [
  {
    id: 1,
    title: "COVID-19 vaccines contain microchips for tracking",
    content: "There is a widespread claim that COVID-19 vaccines contain microchips that allow governments to track citizens movements and activities. This claim has been circulating on social media platforms and some alternative news websites.",
    category: "health",
    status: "false",
    credibilityScore: 15,
    upvotes: 23,
    downvotes: 145,
    evidenceCount: 8,
    discussionCount: 42,
    tags: ["covid", "vaccine", "conspiracy", "health"],
    username: "health_researcher",
    userReputation: 320,
    createdAt: "2024-01-15",
    sourceUrl: "https://example.com/fake-news",
    comments: [
      {
        id: 1,
        content: "This has been thoroughly debunked by multiple health organizations. Vaccines contain only the necessary ingredients to stimulate immune response.",
        username: "science_enthusiast",
        createdAt: "2024-01-15T14:30:00Z"
      },
      {
        id: 2,
        content: "The microchip conspiracy originated from misinformation campaigns. Actual vaccine ingredients are publicly available.",
        username: "fact_checker", 
        createdAt: "2024-01-16T09:15:00Z"
      }
    ],
    evidence: [
      {
        id: 1,
        type: "source",
        content: "WHO statement confirming vaccine ingredients and debunking microchip claims",
        sourceUrl: "https://www.who.int/news-room/feature-stories/detail/vaccine-ingredients",
        username: "health_researcher",
        createdAt: "2024-01-15T11:20:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Climate change is a hoax created by scientists",
    content: "Claim that climate change is not real and was invented by scientists to secure research funding. This ignores decades of peer-reviewed research and global scientific consensus.",
    category: "environment",
    status: "false",
    credibilityScore: 12,
    upvotes: 18,
    downvotes: 210,
    evidenceCount: 15,
    discussionCount: 67,
    tags: ["climate", "environment", "science"],
    username: "climate_expert",
    userReputation: 450,
    createdAt: "2024-01-14",
    sourceUrl: "https://example.com/climate-claim",
    comments: [
      {
        id: 1,
        content: "97% of climate scientists agree that climate change is real and human-caused. This is settled science.",
        username: "climate_scientist",
        createdAt: "2024-01-14T16:45:00Z"
      }
    ],
    evidence: [
      {
        id: 1,
        type: "study",
        content: "NASA climate change evidence with satellite data and temperature records",
        sourceUrl: "https://climate.nasa.gov/evidence/",
        username: "data_analyst",
        createdAt: "2024-01-14T14:20:00Z"
      }
    ]
  },
  {
    id: 3,
    title: "Regular exercise reduces heart disease risk by 35%",
    content: "Studies show that regular physical activity can significantly reduce the risk of heart disease. Multiple large-scale studies confirm these findings across different populations.",
    category: "health",
    status: "verified",
    credibilityScore: 92,
    upvotes: 234,
    downvotes: 18,
    evidenceCount: 12,
    discussionCount: 28,
    tags: ["health", "exercise", "study", "heart"],
    username: "medical_researcher",
    userReputation: 520,
    createdAt: "2024-01-13",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/example",
    comments: [
      {
        id: 1,
        content: "As a cardiologist, I can confirm these findings align with clinical observations.",
        username: "dr_heart",
        createdAt: "2024-01-13T15:30:00Z"
      }
    ],
    evidence: [
      {
        id: 1,
        type: "study",
        content: "Meta-analysis of 33 studies showing 35% reduction in heart disease risk with regular exercise",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/exercise-heart",
        username: "research_team",
        createdAt: "2024-01-13T12:15:00Z"
      }
    ]
  },
  {
    id: 4,
    title: "5G technology causes health problems",
    content: "Claims that 5G cellular technology causes various health issues including cancer and headaches.",
    category: "technology",
    status: "false",
    credibilityScore: 18,
    upvotes: 34,
    downvotes: 167,
    evidenceCount: 9,
    discussionCount: 51,
    tags: ["5g", "technology", "health", "conspiracy"],
    username: "tech_analyst",
    userReputation: 280,
    createdAt: "2024-01-12",
    sourceUrl: "https://example.com/5g-claims",
    comments: [
      {
        id: 1,
        content: "5G radiation is non-ionizing and poses no health risks according to WHO and FCC.",
        username: "physics_expert",
        createdAt: "2024-01-12T17:20:00Z"
      }
    ],
    evidence: [
      {
        id: 1,
        type: "study",
        content: "Comprehensive review of 5G safety studies showing no adverse health effects",
        sourceUrl: "https://who.int/5g-safety",
        username: "safety_researcher",
        createdAt: "2024-01-12T14:30:00Z"
      }
    ]
  }
];

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Toast Component
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    className={`fixed top-4 right-4 p-4 rounded-xl z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white shadow-lg`}
  >
    <div className="flex items-center gap-3">
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">×</button>
    </div>
  </motion.div>
);

// Navigation Component
const Navbar = ({ currentPage, user, onLogout, searchTerm, onSearchChange }) => {
  return (
    <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Truth Collective
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="🔍 Search claims, tags, categories..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/claims" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              Browse Claims
            </Link>
            <Link to="/submit" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              Submit Claim
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-cyan-400 font-medium hidden sm:block">
                    {user.username}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="bg-rose-500/20 text-rose-300 px-4 py-2 rounded-lg hover:bg-rose-500/30 transition-colors text-sm"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-cyan-500/25 transition-all font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Home Page
const Home = ({ user, onLogout, searchTerm, onSearchChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar currentPage="home" user={user} onLogout={onLogout} searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <div className="text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              Truth Collective
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Join thousands of fact-checkers in the fight against misinformation
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/claims"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-cyan-500/25 transition-all"
              >
                Browse Claims
              </Link>
              <Link 
                to="/submit"
                className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-400/10 transition-all"
              >
                Submit Claim
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {[
              { label: 'Claims Verified', value: '1,240+', emoji: '✅' },
              { label: 'Active Users', value: '50K+', emoji: '👥' },
              { label: 'Misinformation Stopped', value: '98%', emoji: '🚫' },
              { label: 'Community Score', value: '4.8/5', emoji: '⭐' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10">
                <div className="text-2xl mb-2">{stat.emoji}</div>
                <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Claims Page
const ClaimsPage = ({ user, onLogout, searchTerm, onSearchChange }) => {
  const [claims] = useState(sampleClaims);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [filter, searchTerm]);

  const filteredClaims = claims.filter(claim => {
    // Search filter
    const matchesSearch = !searchTerm || 
      claim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      claim.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filter === 'all' || claim.status === filter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'from-emerald-500 to-green-500';
      case 'false': return 'from-rose-500 to-red-500';
      default: return 'from-amber-500 to-yellow-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified Fact';
      case 'false': return 'False Claim';
      default: return 'Under Review';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar currentPage="claims" user={user} onLogout={onLogout} searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <div className="text-white p-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            Browse Claims
          </motion.h1>

          {/* Filter Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 mb-8 flex-wrap"
          >
            {['all', 'verified', 'false'].map((filterType) => (
              <motion.button
                key={filterType}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-xl font-medium capitalize ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {filterType}
              </motion.button>
            ))}
          </motion.div>

          {/* Search Results Info */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 text-gray-400"
            >
              Showing {filteredClaims.length} results for "{searchTerm}"
            </motion.div>
          )}

          {/* Claims Grid */}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <motion.div 
              layout
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {filteredClaims.map((claim, index) => (
                  <motion.div
                    key={claim.id}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all group"
                  >
                    <Link to={`/claims/${claim.id}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                            {claim.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {claim.content}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {claim.tags.map(tag => (
                              <span key={tag} className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-400 gap-4 flex-wrap">
                            <span>By {claim.username}</span>
                            <span>•</span>
                            <span>{claim.createdAt}</span>
                            <span>•</span>
                            <span>💬 {claim.discussionCount}</span>
                            <span>•</span>
                            <span>📚 {claim.evidenceCount}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className={`px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(claim.status)} text-white text-sm font-bold mb-2 block`}
                          >
                            {getStatusText(claim.status)}
                          </motion.span>
                          <div className={`text-2xl font-bold ${
                            claim.credibilityScore > 70 ? 'text-emerald-400' : 
                            claim.credibilityScore > 30 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {claim.credibilityScore}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>👍 {claim.upvotes}</span>
                        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs uppercase">
                          {claim.category}
                        </span>
                        <span>👎 {claim.downvotes}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredClaims.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-300 mb-2">No claims found</h3>
                  <p className="text-gray-400">Try adjusting your search or filters</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Claim Detail Page
const ClaimDetailPage = ({ user, onLogout, searchTerm, onSearchChange }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const claim = sampleClaims.find(c => c.id === parseInt(id));
  const [activeTab, setActiveTab] = useState('discussion');
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!claim) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-white mb-4">Claim Not Found</h2>
          <button 
            onClick={() => navigate('/claims')}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-cyan-500/25 transition-all"
          >
            Back to Claims
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'from-emerald-500 to-green-500';
      case 'false': return 'from-rose-500 to-red-500';
      default: return 'from-amber-500 to-yellow-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified Fact';
      case 'false': return 'False Claim';
      default: return 'Under Review';
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to comment', 'error');
      return;
    }
    if (newComment.trim()) {
      showToast('Comment added successfully!', 'success');
      setNewComment('');
    }
  };

  const handleVote = (voteType) => {
    if (!user) {
      showToast('Please login to vote', 'error');
      return;
    }
    showToast(`Voted ${voteType === 'up' ? 'Credible' : 'False'}!`, 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar currentPage="claims" user={user} onLogout={onLogout} searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <div className="text-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(null)} 
              />
            )}
          </AnimatePresence>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/claims')}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            ← Back to Claims
          </motion.button>

          {/* Main Claim Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Claim Content */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm uppercase">
                    {claim.category}
                  </span>
                  <motion.span
                    className={`px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(claim.status)} text-white font-bold`}
                  >
                    {getStatusText(claim.status)}
                  </motion.span>
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-6">
                  {claim.title}
                </h1>
                
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  {claim.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {claim.tags.map(tag => (
                    <span key={tag} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400">Submitted By</div>
                    <div className="text-white font-medium">{claim.username}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400">Date Submitted</div>
                    <div className="text-white font-medium">{claim.createdAt}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400">Evidence Submitted</div>
                    <div className="text-white font-medium">{claim.evidenceCount} sources</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400">Community Discussion</div>
                    <div className="text-white font-medium">{claim.discussionCount} comments</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Credibility & Voting */}
              <div className="space-y-6">
                {/* Credibility Score */}
                <div className="bg-white/5 rounded-2xl p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className={`text-4xl font-bold ${
                      claim.credibilityScore > 70 ? 'text-emerald-400' : 
                      claim.credibilityScore > 30 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {claim.credibilityScore}%
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm mb-4">Community Verdict</div>
                  
                  {/* Voting Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote('up')}
                      className="w-full bg-emerald-500/20 text-emerald-300 py-3 rounded-xl font-bold hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      👍 Credible ({claim.upvotes})
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote('down')}
                      className="w-full bg-rose-500/20 text-rose-300 py-3 rounded-xl font-bold hover:bg-rose-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      👎 False ({claim.downvotes})
                    </motion.button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">Community Consensus</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-emerald-400">Credible</span>
                        <span>{Math.round((claim.upvotes / (claim.upvotes + claim.downvotes)) * 100) || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.round((claim.upvotes / (claim.upvotes + claim.downvotes)) * 100) || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-rose-400">False</span>
                        <span>{Math.round((claim.downvotes / (claim.upvotes + claim.downvotes)) * 100) || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-rose-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.round((claim.downvotes / (claim.upvotes + claim.downvotes)) * 100) || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs for Discussion & Evidence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
          >
            {/* Tab Headers */}
            <div className="flex border-b border-white/10">
              {['discussion', 'evidence', 'sources'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab} {tab === 'discussion' && `(${claim.discussionCount})`}
                  {tab === 'evidence' && `(${claim.evidenceCount})`}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'discussion' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="bg-white/5 rounded-xl p-4">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts, analysis, or additional context..."
                        rows="3"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors resize-vertical"
                      />
                      <div className="flex justify-end mt-3">
                        <motion.button
                          type="submit"
                          disabled={!newComment.trim()}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post Comment
                        </motion.button>
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {claim.comments?.map(comment => (
                        <div key={comment.id} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {comment.username?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-white">{comment.username}</div>
                                <div className="text-gray-400 text-sm">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-300">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'evidence' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {claim.evidence?.map(evidence => (
                      <div key={evidence.id} className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              evidence.type === 'source' ? 'bg-blue-500/20 text-blue-300' :
                              evidence.type === 'study' ? 'bg-emerald-500/20 text-emerald-300' :
                              'bg-amber-500/20 text-amber-300'
                            }`}>
                              {evidence.type}
                            </div>
                            <div className="text-gray-400 text-sm">
                              Added by {evidence.username}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-3">{evidence.content}</p>
                        {evidence.sourceUrl && (
                          <a 
                            href={evidence.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm break-all"
                          >
                            🔗 {evidence.sourceUrl}
                          </a>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'sources' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {claim.sourceUrl && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="font-semibold text-white mb-2">Original Source</h4>
                        <a 
                          href={claim.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 break-all"
                        >
                          {claim.sourceUrl}
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Submit Page
const SubmitPage = ({ user, onLogout, searchTerm, onSearchChange }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'politics',
    tags: '',
    sourceUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to submit a claim', 'error');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      showToast('Claim submitted successfully! The community will now review it.', 'success');
      setFormData({ title: '', content: '', category: 'politics', tags: '', sourceUrl: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar currentPage="submit" user={user} onLogout={onLogout} searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <div className="text-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(null)} 
              />
            )}
          </AnimatePresence>

          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            Submit Claim
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
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
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  >
                    <option value="politics">Politics</option>
                    <option value="health">Health</option>
                    <option value="science">Science</option>
                    <option value="technology">Technology</option>
                    <option value="environment">Environment</option>
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

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit for Verification'
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Login Page
const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    const userData = {
      id: '1',
      username: formData.email.split('@')[0] || 'user',
      email: formData.email
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Truth Collective
          </h1>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to continue fact-checking</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-cyan-500/25 transition-all"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-center">
          <p className="text-cyan-300 text-sm">
            <strong>Demo:</strong> Use any email and password to test
          </p>
        </div>
      </div>
    </div>
  );
};

// Register Page
const RegisterPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Simulate registration
    const userData = {
      id: Date.now().toString(),
      username: formData.username,
      email: formData.email
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Truth Collective
          </h1>
          <h2 className="text-3xl font-bold text-white">Join the Community</h2>
          <p className="text-gray-400 mt-2">Start fact-checking today</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-cyan-500/25 transition-all"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App
function App() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} searchTerm={searchTerm} onSearchChange={setSearchTerm} />} />
        <Route path="/claims" element={<ClaimsPage user={user} onLogout={handleLogout} searchTerm={searchTerm} onSearchChange={setSearchTerm} />} />
        <Route path="/claims/:id" element={<ClaimDetailPage user={user} onLogout={handleLogout} searchTerm={searchTerm} onSearchChange={setSearchTerm} />} />
        <Route path="/submit" element={<SubmitPage user={user} onLogout={handleLogout} searchTerm={searchTerm} onSearchChange={setSearchTerm} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;