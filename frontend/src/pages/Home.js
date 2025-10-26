import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const Home = ({ user }) => {
  const [trendingClaims, setTrendingClaims] = useState([]);
  const [recentClaims, setRecentClaims] = useState([]);
  const [stats, setStats] = useState({ totalClaims: 0, verified: 0, activeUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      const [trendingData, recentData, statsData] = await Promise.all([
        api.getTrendingClaims(),
        api.getRecentClaims(),
        api.getStats()
      ]);
      setTrendingClaims(trendingData);
      setRecentClaims(recentData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load home data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'from-emerald-500 to-green-500';
      case 'disputed': return 'from-rose-500 to-red-500';
      default: return 'from-amber-500 to-yellow-500';
    }
  };

  const getCredibilityIcon = (score) => {
    if (score > 20) return '🚀';
    if (score > 10) return '⭐';
    if (score > 0) return '👍';
    if (score > -10) return '🤔';
    if (score > -20) return '⚠️';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-gradient"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Truth Collective
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Join the fight against misinformation. Collaborate with the community to verify claims, 
              share evidence, and promote factual accuracy through collective intelligence.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {user ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/submit-claim"
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all block"
                    >
                      Submit a Claim
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/claims"
                      className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-400/10 transition-all block"
                    >
                      Browse Claims
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all block"
                    >
                      Join the Community
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/claims"
                      className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-400/10 transition-all block"
                    >
                      Explore Claims
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { label: 'Claims Verified', value: stats.verified, emoji: '✅', color: 'text-emerald-400' },
              { label: 'Total Claims', value: stats.totalClaims, emoji: '📊', color: 'text-cyan-400' },
              { label: 'Active Fact-Checkers', value: stats.activeUsers, emoji: '👥', color: 'text-purple-400' },
              { label: 'Accuracy Rate', value: '92%', emoji: '🎯', color: 'text-amber-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center hover:border-cyan-400/50 transition-all"
              >
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trending Claims */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🔥 Trending Claims
              </h2>
              <Link
                to="/claims"
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2"
              >
                View All <span>→</span>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {trendingClaims.slice(0, 3).map((claim, index) => (
                  <motion.div
                    key={claim.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all group"
                  >
                    <Link to={`/claims/${claim.id}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{getCredibilityIcon(claim.credibilityScore)}</span>
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className={`px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(claim.status)} text-white text-sm font-bold`}
                            >
                              {claim.status}
                            </motion.span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-3 line-clamp-3 group-hover:text-cyan-300 transition-colors">
                            {claim.text}
                          </h3>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {claim.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>By {claim.username}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            👍 {claim.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            👎 {claim.downvotes}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ⚡ Recent Activity
              </h2>
              <Link
                to="/claims"
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2"
              >
                View All <span>→</span>
              </Link>
            </div>

            <div className="grid gap-4">
              {recentClaims.slice(0, 5).map((claim, index) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all group"
                >
                  <Link to={`/claims/${claim.id}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        claim.status === 'verified' ? 'bg-emerald-400' :
                        claim.status === 'disputed' ? 'bg-rose-400' : 'bg-amber-400'
                      }`} />
                      <p className="text-white group-hover:text-cyan-300 transition-colors line-clamp-1 flex-1">
                        {claim.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        {getCredibilityIcon(claim.credibilityScore)} {claim.credibilityScore}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of fact-checkers in the fight against misinformation. Your voice matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/submit-claim"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all block"
                  >
                    Submit Your First Claim
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all block"
                    >
                      Sign Up Free
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/claims"
                      className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-400/10 transition-all block"
                    >
                      Explore Claims
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;