export const api = {
  // Claims endpoints with mock data
  getClaims: () => Promise.resolve([
    {
      id: '1',
      title: 'COVID-19 vaccines contain microchips for tracking',
      content: 'There is a widespread claim that COVID-19 vaccines contain microchips that allow governments to track citizens movements and activities.',
      sourceUrl: 'https://example.com/fake-news',
      category: 'health',
      status: 'false',
      credibilityScore: 15,
      upvotes: 23,
      downvotes: 145,
      evidenceCount: 8,
      discussionCount: 42,
      tags: ['covid', 'vaccine', 'conspiracy', 'health'],
      username: 'health_researcher',
      userReputation: 320,
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      aiModeration: { flag: 'potential_misinfo', confidence: 0.92 }
    },
    {
      id: '2',
      title: 'Climate change is a hoax created by scientists',
      content: 'Some claim that climate change is not real and was invented by scientists to secure research funding.',
      sourceUrl: 'https://example.com/climate-claim',
      category: 'environment',
      status: 'false',
      credibilityScore: 12,
      upvotes: 18,
      downvotes: 210,
      evidenceCount: 15,
      discussionCount: 67,
      tags: ['climate', 'environment', 'science'],
      username: 'climate_factchecker',
      userReputation: 450,
      createdAt: '2024-01-08T14:20:00Z',
      updatedAt: '2024-01-12T09:15:00Z',
      aiModeration: { flag: 'potential_misinfo', confidence: 0.88 }
    },
    {
      id: '3',
      title: 'Eating carrots significantly improves night vision',
      content: 'The claim that eating carrots can dramatically improve your ability to see in the dark.',
      sourceUrl: '',
      category: 'health',
      status: 'misleading',
      credibilityScore: 45,
      upvotes: 89,
      downvotes: 110,
      evidenceCount: 6,
      discussionCount: 31,
      tags: ['health', 'nutrition', 'myth'],
      username: 'nutrition_expert',
      userReputation: 280,
      createdAt: '2024-01-05T08:15:00Z',
      updatedAt: '2024-01-10T16:45:00Z',
      aiModeration: { flag: 'needs_review', confidence: 0.65 }
    },
    {
      id: '4',
      title: 'Regular exercise reduces risk of heart disease by 35%',
      content: 'Studies show that regular physical activity can reduce the risk of heart disease by approximately 35%.',
      sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/example',
      category: 'health',
      status: 'verified',
      credibilityScore: 92,
      upvotes: 234,
      downvotes: 18,
      evidenceCount: 12,
      discussionCount: 28,
      tags: ['health', 'exercise', 'heart', 'study'],
      username: 'medical_researcher',
      userReputation: 520,
      createdAt: '2024-01-12T11:20:00Z',
      updatedAt: '2024-01-14T13:10:00Z',
      aiModeration: { flag: 'none', confidence: 0.95 }
    }
  ]),

  getClaim: (id) => Promise.resolve({
    id: id,
    title: 'COVID-19 vaccines contain microchips for tracking',
    content: 'There is a widespread claim that COVID-19 vaccines contain microchips that allow governments to track citizens movements and activities. This claim has been circulating on social media platforms and some alternative news websites.',
    sourceUrl: 'https://example.com/fake-news',
    category: 'health',
    status: 'false',
    credibilityScore: 15,
    upvotes: 23,
    downvotes: 145,
    evidenceCount: 8,
    discussionCount: 42,
    tags: ['covid', 'vaccine', 'conspiracy', 'health'],
    username: 'health_researcher',
    userReputation: 320,
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    aiModeration: { flag: 'potential_misinfo', confidence: 0.92 },
    comments: [
      {
        id: '1',
        content: 'This has been thoroughly debunked by multiple health organizations. Vaccines contain only the necessary ingredients to stimulate immune response.',
        username: 'science_enthusiast',
        createdAt: '2024-01-10T14:30:00Z'
      },
      {
        id: '2', 
        content: 'The microchip conspiracy originated from misinformation campaigns. Actual vaccine ingredients are publicly available.',
        username: 'fact_checker',
        createdAt: '2024-01-11T09:15:00Z'
      }
    ],
    evidence: [
      {
        id: '1',
        type: 'source',
        content: 'WHO statement confirming vaccine ingredients and debunking microchip claims',
        sourceUrl: 'https://www.who.int/news-room/feature-stories/detail/vaccine-ingredients',
        username: 'health_researcher',
        createdAt: '2024-01-10T11:20:00Z'
      },
      {
        id: '2',
        type: 'study',
        content: 'Peer-reviewed study analyzing vaccine composition across multiple manufacturers',
        sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/vaccine-composition',
        username: 'medical_expert',
        createdAt: '2024-01-11T16:45:00Z'
      }
    ]
  }),

  createClaim: (claimData) => {
    console.log('Submitting claim:', claimData);
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClaim = {
          id: Date.now().toString(),
          ...claimData,
          status: 'under_review',
          credibilityScore: 50,
          upvotes: 0,
          downvotes: 0,
          evidenceCount: 0,
          discussionCount: 0,
          username: 'current_user', // This would come from your user context
          userReputation: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          aiModeration: { flag: 'none', confidence: 0 }
        };
        resolve(newClaim);
      }, 1500);
    });
  },

  // Voting system (mock)
  voteClaim: (claimId, voteType) => {
    console.log(`Voting ${voteType} on claim ${claimId}`);
    return Promise.resolve({ success: true });
  },

  // Evidence and discussions (mock)
  addEvidence: (claimId, evidenceData) => {
    console.log('Adding evidence to claim:', claimId, evidenceData);
    return Promise.resolve({ success: true });
  },

  addComment: (claimId, commentData) => {
    console.log('Adding comment to claim:', claimId, commentData);
    return Promise.resolve({ success: true });
  },

  // Homepage data (mock)
  getTrendingClaims: () => Promise.resolve([
    // Return first 2 claims as trending
    {
      id: '1',
      title: 'COVID-19 vaccines contain microchips for tracking',
      content: 'There is a widespread claim that COVID-19 vaccines contain microchips...',
      credibilityScore: 15,
      upvotes: 23,
      downvotes: 145,
      discussionCount: 42,
      username: 'health_researcher'
    },
    {
      id: '4', 
      title: 'Regular exercise reduces risk of heart disease by 35%',
      content: 'Studies show that regular physical activity can reduce the risk...',
      credibilityScore: 92,
      upvotes: 234,
      downvotes: 18,
      discussionCount: 28,
      username: 'medical_researcher'
    }
  ]),

  getRecentClaims: () => Promise.resolve([
    // Return all claims as recent
    {
      id: '1',
      title: 'COVID-19 vaccines contain microchips for tracking',
      credibilityScore: 15,
      status: 'false',
      createdAt: '2024-01-10T10:30:00Z'
    },
    {
      id: '2',
      title: 'Climate change is a hoax created by scientists', 
      credibilityScore: 12,
      status: 'false',
      createdAt: '2024-01-08T14:20:00Z'
    },
    {
      id: '3',
      title: 'Eating carrots significantly improves night vision',
      credibilityScore: 45,
      status: 'misleading',
      createdAt: '2024-01-05T08:15:00Z'
    },
    {
      id: '4',
      title: 'Regular exercise reduces risk of heart disease by 35%',
      credibilityScore: 92,
      status: 'verified',
      createdAt: '2024-01-12T11:20:00Z'
    }
  ]),

  getStats: () => Promise.resolve({
    totalClaims: 156,
    verified: 42,
    activeUsers: 1280
  }),

  // Search and filtering
  searchClaims: (query) => Promise.resolve([
    // Mock search results
    {
      id: '1',
      title: 'COVID-19 vaccines contain microchips for tracking',
      content: 'There is a widespread claim that COVID-19 vaccines contain microchips...',
      credibilityScore: 15,
      tags: ['covid', 'vaccine', 'conspiracy']
    }
  ])
};