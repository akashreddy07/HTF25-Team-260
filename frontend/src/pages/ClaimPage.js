import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const ClaimPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discussion');
  const [newComment, setNewComment] = useState('');
  const [newEvidence, setNewEvidence] = useState({
    content: '',
    sourceUrl: '',
    type: 'source'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadClaim();
  }, [id]);

  const loadClaim = async () => {
    try {
      setIsLoading(true);
      const claimData = await api.getClaim(id);
      setClaim(claimData);
    } catch (error) {
      console.error('Failed to load claim:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }

    try {
      await api.voteClaim(id, voteType);
      loadClaim(); // Reload to get updated scores
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await api.addComment(id, { content: newComment });
      setNewComment('');
      loadClaim(); // Reload to get updated comments
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEvidence = async (e) => {
    e.preventDefault();
    if (!user || !newEvidence.content.trim()) return;

    setIsSubmitting(true);
    try {
      await api.addEvidence(id, newEvidence);
      setNewEvidence({ content: '', sourceUrl: '', type: 'source' });
      loadClaim(); // Reload to get updated evidence
    } catch (error) {
      console.error('Failed to add evidence:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!claim) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-white mb-4">Claim Not Found</h2>
          <p className="text-gray-300 mb-8">The claim you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/claims"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-cyan-500/25 transition-all"
          >
            Back to Claims
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            to="/claims"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Claims
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm uppercase">
              {claim.category || 'general'}
            </span>
            <motion.span
              className={`px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(claim.status)} text-white font-bold`}
            >
              {getStatusText(claim.status)}
            </motion.span>
          </div>
        </motion.div>

        {/* Main Claim Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Claim Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-white mb-6">
                {claim.title || claim.content?.substring(0, 100) || claim.text?.substring(0, 100)}
              </h1>
              
              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-lg text-gray-300 leading-relaxed">
                  {claim.content || claim.text}
                </p>
              </div>

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
                  <div className="text-gray-400">Date</div>
                  <div className="text-white font-medium">{new Date(claim.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400">Evidence</div>
                  <div className="text-white font-medium">{claim.evidenceCount || 0} sources</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400">Discussion</div>
                  <div className="text-white font-medium">{claim.discussionCount || 0} comments</div>
                </div>
              </div>
            </div>

            {/* Right Column - Credibility & Voting */}
            <div className="space-y-6">
              {/* Credibility Score */}
              <div className="bg-white/5 rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-3xl">{getCredibilityIcon(claim.credibilityScore)}</span>
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
                {tab} {tab === 'discussion' && `(${claim.discussionCount || 0})`}
                {tab === 'evidence' && `(${claim.evidenceCount || 0})`}
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
                  {user ? (
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
                          disabled={isSubmitting || !newComment.trim()}
                          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                          className="px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Posting...' : 'Post Comment'}
                        </motion.button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-white/5 rounded-xl p-6 text-center">
                      <p className="text-gray-400 mb-4">Please log in to participate in the discussion</p>
                      <Link
                        to="/login"
                        className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
                      >
                        Login to Comment
                      </Link>
                    </div>
                  )}

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

                    {(!claim.comments || claim.comments.length === 0) && (
                      <div className="text-center py-8 text-gray-400">
                        No comments yet. Be the first to start the discussion!
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'evidence' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Add Evidence Form */}
                  {user ? (
                    <form onSubmit={handleAddEvidence} className="bg-white/5 rounded-xl p-4 space-y-4">
                      <select
                        value={newEvidence.type}
                        onChange={(e) => setNewEvidence(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
                      >
                        <option value="source" className="bg-slate-800">Source</option>
                        <option value="study" className="bg-slate-800">Study/Research</option>
                        <option value="expert" className="bg-slate-800">Expert Opinion</option>
                        <option value="data" className="bg-slate-800">Data/Analysis</option>
                      </select>
                      
                      <textarea
                        value={newEvidence.content}
                        onChange={(e) => setNewEvidence(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Describe the evidence, include key findings or quotes..."
                        rows="3"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors resize-vertical"
                      />
                      
                      <input
                        type="url"
                        value={newEvidence.sourceUrl}
                        onChange={(e) => setNewEvidence(prev => ({ ...prev, sourceUrl: e.target.value }))}
                        placeholder="Source URL (optional)"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                      />
                      
                      <div className="flex justify-end">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting || !newEvidence.content.trim()}
                          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                          className="px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Adding...' : 'Add Evidence'}
                        </motion.button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-white/5 rounded-xl p-6 text-center">
                      <p className="text-gray-400 mb-4">Please log in to submit evidence</p>
                      <Link
                        to="/login"
                        className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
                      >
                        Login to Add Evidence
                      </Link>
                    </div>
                  )}

                  {/* Evidence List */}
                  <div className="space-y-4">
                    {claim.evidence?.map(evidence => (
                      <div key={evidence.id} className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              evidence.type === 'source' ? 'bg-blue-500/20 text-blue-300' :
                              evidence.type === 'study' ? 'bg-emerald-500/20 text-emerald-300' :
                              evidence.type === 'expert' ? 'bg-purple-500/20 text-purple-300' :
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

                    {(!claim.evidence || claim.evidence.length === 0) && (
                      <div className="text-center py-8 text-gray-400">
                        No evidence submitted yet. Be the first to contribute!
                      </div>
                    )}
                  </div>
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
                  
                  {/* Additional sources from evidence */}
                  {claim.evidence?.filter(e => e.sourceUrl).map((evidence, index) => (
                    <div key={evidence.id} className="bg-white/5 rounded-xl p-4">
                      <h4 className="font-semibold text-white mb-2">Reference Source {index + 1}</h4>
                      <a 
                        href={evidence.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 break-all"
                      >
                        {evidence.sourceUrl}
                      </a>
                      <p className="text-gray-400 text-sm mt-2">{evidence.content}</p>
                    </div>
                  ))}

                  {!claim.sourceUrl && (!claim.evidence || claim.evidence.filter(e => e.sourceUrl).length === 0) && (
                    <div className="text-center py-8 text-gray-400">
                      No sources available yet.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClaimPage;