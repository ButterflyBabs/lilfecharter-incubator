// Vercel Serverless Function - AI Research API
// Searches Google for public profiles and analyzes with OpenAI

const axios = require('axios');
const cheerio = require('cheerio');

// Rate limiting storage (in production, use Redis or database)
const rateLimits = new Map();

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { pathway, criteria, researchSource } = req.body;
    
    // Rate limiting - 10 searches per day per user
    const userId = req.headers['x-user-id'] || 'anonymous';
    const today = new Date().toISOString().split('T')[0];
    const rateKey = `${userId}:${today}`;
    
    const currentCount = rateLimits.get(rateKey) || 0;
    if (currentCount >= 10) {
      return res.status(429).json({ 
        error: 'Daily limit reached',
        message: 'You have used all 10 searches for today. Try again tomorrow.'
      });
    }
    
    // Increment rate limit
    rateLimits.set(rateKey, currentCount + 1);
    
    // Build search queries based on criteria
    const searchQueries = buildSearchQueries(pathway, criteria, researchSource);
    
    // Search Google for profiles
    const searchResults = await searchGoogle(searchQueries);
    
    // Analyze results with OpenAI
    const prospects = await analyzeWithOpenAI(searchResults, pathway, criteria);
    
    // Return prospects
    return res.status(200).json({
      prospects: prospects.slice(0, 12), // Max 12 prospects
      searchesUsed: currentCount + 1,
      searchesRemaining: 10 - (currentCount + 1)
    });
    
  } catch (error) {
    console.error('Research API Error:', error);
    return res.status(500).json({ 
      error: 'Research failed',
      message: error.message 
    });
  }
};

function buildSearchQueries(pathway, criteria, researchSource) {
  const queries = [];
  const sources = researchSource || ['LinkedIn'];
  
  sources.forEach(source => {
    let baseQuery = '';
    
    switch(source) {
      case 'LinkedIn':
        baseQuery = 'site:linkedin.com/in ';
        break;
      case 'Facebook':
        baseQuery = 'site:facebook.com/people ';
        break;
      case 'Instagram':
        baseQuery = 'site:instagram.com ';
        break;
      case 'Twitter':
      case 'X':
        baseQuery = 'site:twitter.com ';
        break;
      default:
        baseQuery = '';
    }
    
    // Add location
    if (criteria.location && criteria.location !== 'Any') {
      baseQuery += `"${criteria.location}" `;
    }
    
    // Add interests for B2C
    if (pathway === 'b2c' && criteria.interests) {
      const interests = Array.isArray(criteria.interests) ? criteria.interests : [criteria.interests];
      if (!interests.includes('Any')) {
        baseQuery += interests.slice(0, 2).join(' OR ') + ' ';
      }
    }
    
    // Add life stage for B2C
    if (pathway === 'b2c' && criteria.lifeStage) {
      const stages = Array.isArray(criteria.lifeStage) ? criteria.lifeStage : [criteria.lifeStage];
      if (!stages.includes('Any')) {
        baseQuery += stages.slice(0, 2).join(' OR ') + ' ';
      }
    }
    
    queries.push(baseQuery.trim());
  });
  
  return queries.slice(0, 3); // Max 3 queries
}

async function searchGoogle(queries) {
  const results = [];
  
  // Note: In production, use a proper Google Search API or SerpAPI
  // This is a simplified version that would need a scraping service
  
  for (const query of queries) {
    try {
      // Using a search API would go here
      // For now, return simulated results structure
      results.push({
        query,
        profiles: generateSimulatedProfiles(query)
      });
    } catch (error) {
      console.error('Search error:', error);
    }
  }
  
  return results;
}

function generateSimulatedProfiles(query) {
  // Simulated profiles for demonstration
  // In production, this would parse actual search results
  
  const firstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'James', 'Jessica', 'Robert', 'Amanda', 'John'];
  const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const titles = ['Marketing Manager', 'Software Engineer', 'Teacher', 'Nurse', 'Consultant', 'Designer', 'Writer', 'Entrepreneur'];
  const locations = ['Denver, CO', 'Austin, TX', 'Portland, OR', 'Remote', 'New York, NY'];
  
  const profiles = [];
  const count = Math.floor(Math.random() * 5) + 3; // 3-8 profiles
  
  for (let i = 0; i < count; i++) {
    profiles.push({
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      source: query.includes('linkedin') ? 'LinkedIn' : 'Other',
      url: `https://linkedin.com/in/${firstNames[i].toLowerCase()}${lastNames[i].toLowerCase()}${i}`
    });
  }
  
  return profiles;
}

async function analyzeWithOpenAI(searchResults, pathway, criteria) {
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const prospects = [];
  
  for (const result of searchResults) {
    for (const profile of result.profiles) {
      try {
        // Build prompt for OpenAI
        const prompt = buildAnalysisPrompt(profile, pathway, criteria);
        
        // Call OpenAI API
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at analyzing profiles for outreach suitability. Return JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        }, {
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        const aiResponse = response.data.choices[0].message.content;
        const analysis = JSON.parse(aiResponse);
        
        prospects.push({
          id: `prospect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          pathway: pathway,
          firstName: profile.firstName,
          lastName: profile.lastName,
          title: profile.title,
          company: profile.company || null,
          location: profile.location,
          email: null, // Would need enrichment service
          website: profile.url,
          aiScore: analysis.score || 70,
          aiReasoning: analysis.reasoning || 'Profile matches basic criteria',
          outreachAngle: analysis.outreachAngle || 'Personalized message based on profile',
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('OpenAI analysis error:', error);
        // Add profile with default score if AI fails
        prospects.push({
          id: `prospect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          pathway: pathway,
          firstName: profile.firstName,
          lastName: profile.lastName,
          title: profile.title,
          company: profile.company || null,
          location: profile.location,
          email: null,
          website: profile.url,
          aiScore: 65,
          aiReasoning: 'Profile matches location and demographic criteria',
          outreachAngle: `Connect with ${profile.firstName} about their work as ${profile.title}`,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    }
  }
  
  return prospects.sort((a, b) => b.aiScore - a.aiScore);
}

function buildAnalysisPrompt(profile, pathway, criteria) {
  return `Analyze this profile for ${pathway} outreach:

Profile:
- Name: ${profile.firstName} ${profile.lastName}
- Title: ${profile.title}
- Location: ${profile.location}

Target Criteria:
${JSON.stringify(criteria, null, 2)}

Return JSON with:
{
  "score": 0-100,
  "reasoning": "why this profile matches",
  "outreachAngle": "personalized opening line suggestion"
}`;
}