// API endpoint for Life by Design Summit registrations
// Creates contact in Global Control and applies appropriate tag

const GC_API_KEY = '1a43470a5286cb999b708630d70ebf8888bccc8d28486e10d89c5c25b532f88a';
const GC_API_URL = 'https://api.globalcontrol.io/api/ai';

// Tag IDs for different registration types
const TAGS = {
  master: '69fa7553f047865f2e631d4d',      // LBD-Summit-Registered (applied to ALL)
  free: '69fa7553f047865f2e631e05',         // LBD-Free-Registration
  nextchapter: '69fa7553f047865f2e631eb9',  // LBD-Next-Chapter-Pass
  integration: '69fa7553f047865f2e631f6d'   // LBD-Integration-Pass
};

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
    const { firstName, lastName, email, phone, timezone, registrationType } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !registrationType) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email', 'registrationType']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate registration type
    if (!TAGS[registrationType]) {
      return res.status(400).json({ 
        error: 'Invalid registration type',
        validTypes: Object.keys(TAGS)
      });
    }

    console.log('Processing registration:', { firstName, lastName, email, registrationType });

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
        // Store timezone in custom field if needed
        customFields: timezone ? {
          timezone: timezone
        } : undefined
      })
    });

    if (!contactResponse.ok) {
      const errorText = await contactResponse.text();
      console.error('Global Control contact creation failed:', errorText);
      throw new Error('Failed to create contact in CRM');
    }

    const contactData = await contactResponse.json();
    console.log('Contact created/updated:', contactData);

    // Step 2: Apply the MASTER tag (LBD-Summit-Registered) to ALL registrants
    const masterTagResponse = await fetch(`${GC_API_URL}/tags/fire-tag/${TAGS.master}`, {
      method: 'POST',
      headers: {
        'X-API-KEY': GC_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim()
      })
    });

    if (!masterTagResponse.ok) {
      const errorText = await masterTagResponse.text();
      console.error('Global Control master tag application failed:', errorText);
      console.warn('Master tag application failed but contact was created');
    } else {
      console.log('Master tag applied successfully: LBD-Summit-Registered');
    }

    // Step 3: Apply the specific registration type tag
    const specificTagId = TAGS[registrationType];
    const specificTagResponse = await fetch(`${GC_API_URL}/tags/fire-tag/${specificTagId}`, {
      method: 'POST',
      headers: {
        'X-API-KEY': GC_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim()
      })
    });

    if (!specificTagResponse.ok) {
      const errorText = await specificTagResponse.text();
      console.error('Global Control specific tag application failed:', errorText);
      console.warn('Specific tag application failed but contact and master tag were created');
    } else {
      console.log('Specific tag applied successfully:', registrationType);
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Registration successful',
      registrationType: registrationType,
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