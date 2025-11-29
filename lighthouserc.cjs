module.exports = {
   ci: {
      collect: {
         url: ['http://localhost:5173'],
         numberOfRuns: 3,
         startServerCommand: 'npm run dev',
         startServerReadyPattern: 'ready in',
      },
      assert: {
         preset: 'lighthouse:recommended',
         assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['warn', { minScore: 0.9 }],
            'categories:seo': ['warn', { minScore: 0.9 }],
            // Specific metric thresholds
            'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
            'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['warn', { maxNumericValue: 300 }],
         },
      },
      upload: {
         target: 'temporary-public-storage',
      },
   },
};
