// API endpoint for LifeCharter Incubator registrations
// Creates contact in Global Control and applies incubator-registration tag

const GC_API_KEY = '57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d';
const GC_API_URL = 'https://api.globalcontrol.io/api/ai';
const TAG_ID = '69fa1666f047865f2e391269'; // incubator-registration tag

export default async function handler(req, res) {
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
    const { firstName, lastName, email, phone, growthJourney, misalignment, outcomes, readiness, reflection } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('Received data:', { firstName, lastName, email, phone, growthJourney, misalignment, outcomes, readiness, reflection });
    console.log('Processing Incubator registration:', { firstName, lastName, email });

    // Build survey summary
    const surveySummary = `Growth Journey: ${growthJourney || 'Not specified'} | Misalignment: ${misalignment || 'Not specified'} | Outcomes: ${outcomes || 'Not specified'} | Readiness: ${readiness || 'Not specified'} | Reflection: ${reflection || 'Not specified'}`;

    // Step 1: Create or update contact in Global Control
    const contactResponse = await fetch(`${GC_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'X-API-KEY': GC_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone ? phone.trim() : undefined,
        address: surveySummary
      })
    });

    if (!contactResponse.ok) {
      const errorText = await contactResponse.text();
      console.error('Global Control contact creation failed:', errorText);
      throw new Error('Failed to create contact in CRM');
    }

    const contactData = await contactResponse.json();
    console.log('Contact created/updated:', contactData);

    // Step 2: Apply the incubator-registration tag
    const tagResponse = await fetch(`${GC_API_URL}/tags/fire-tag/${TAG_ID}`, {
      method: 'POST',
      headers: {
        'X-API-KEY': GC_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim()
      })
    });

    if (!tagResponse.ok) {
      const errorText = await tagResponse.text();
      console.error('Global Control tag application failed:', errorText);
      console.warn('Tag application failed but contact was created');
    } else {
      console.log('Tag applied successfully: incubator-registration');
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Registration successful',
      email: email
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
}