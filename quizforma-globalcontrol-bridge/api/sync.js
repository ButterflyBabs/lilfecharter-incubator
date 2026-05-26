// QuizForma to Global Control Sync Bridge
// Polls QuizForma for new Incubator registrations and syncs to Global Control CRM

const QUIZFORMA_API_KEY = process.env.QUIZFORMA_API_KEY;
const GLOBAL_CONTROL_API_KEY = process.env.GLOBAL_CONTROL_API_KEY;

// Quiz ID for LifeCharter Incubator registration
const QUIZ_ID = 'OnIHaPZl381DWhz';

// Tag to apply in Global Control
const TAG_NAME = 'LifeCharter Incubator';
const TAG_GROUP = 'Events';

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get last sync timestamp (or default to 24 hours ago)
    const lastSync = req.query.since || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    console.log(`[SYNC] Starting sync since: ${lastSync}`);

    // Step 1: Get responses from QuizForma
    const responses = await getQuizFormaResponses(QUIZ_ID, lastSync);
    console.log(`[SYNC] Found ${responses.length} new responses`);

    if (responses.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new responses to sync',
        synced: 0,
        since: lastSync
      });
    }

    // Step 2: Ensure tag exists in Global Control
    const tagId = await ensureTagExists(TAG_NAME, TAG_GROUP);
    console.log(`[SYNC] Using tag ID: ${tagId}`);

    // Step 3: Sync each response to Global Control
    const results = [];
    for (const response of responses) {
      try {
        const result = await syncResponseToGlobalControl(response, tagId);
        results.push(result);
      } catch (error) {
        console.error(`[SYNC ERROR] Failed to sync response ${response.id}:`, error.message);
        results.push({
          responseId: response.id,
          success: false,
          error: error.message
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`[SYNC] Complete: ${successful} synced, ${failed} failed`);

    return res.status(200).json({
      success: true,
      message: `Synced ${successful} contacts to Global Control`,
      synced: successful,
      failed: failed,
      since: lastSync,
      results: results
    });

  } catch (error) {
    console.error('[SYNC ERROR]', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get responses from QuizForma
async function getQuizFormaResponses(quizId, since) {
  const url = `https://api.quizforma.com/api/ai/quiz/${quizId}/responses`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': QUIZFORMA_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`QuizForma API error: ${error}`);
  }

  const data = await response.json();
  
  if (!data.status || !data.data) {
    throw new Error('Invalid response from QuizForma API');
  }

  // Filter responses since last sync
  const responses = Array.isArray(data.data) ? data.data : [data.data];
  const sinceDate = new Date(since);
  
  return responses.filter(r => {
    const responseDate = new Date(r.created_at || r.submitted_at || r.updated_at);
    return responseDate >= sinceDate;
  });
}

// Ensure tag exists in Global Control, create if not
async function ensureTagExists(tagName, groupName) {
  // First, try to find existing tag
  const tagsResponse = await fetch('https://api.globalcontrol.io/api/ai/tags', {
    method: 'GET',
    headers: {
      'X-API-KEY': GLOBAL_CONTROL_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  if (!tagsResponse.ok) {
    throw new Error('Failed to fetch tags from Global Control');
  }

  const tagsData = await tagsResponse.json();
  const existingTag = tagsData.find(t => t.name === tagName);
  
  if (existingTag) {
    return existingTag.id;
  }

  // Tag doesn't exist, need to create it
  // First ensure tag group exists
  const groupId = await ensureTagGroupExists(groupName);
  
  // Create the tag
  const createResponse = await fetch('https://api.globalcontrol.io/api/ai/tags', {
    method: 'POST',
    headers: {
      'X-API-KEY': GLOBAL_CONTROL_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: tagName,
      groupId: groupId
    })
  });

  if (!createResponse.ok) {
    const error = await createResponse.text();
    throw new Error(`Failed to create tag: ${error}`);
  }

  const newTag = await createResponse.json();
  return newTag.id;
}

// Ensure tag group exists
async function ensureTagGroupExists(groupName) {
  const groupsResponse = await fetch('https://api.globalcontrol.io/api/ai/tag-groups', {
    method: 'GET',
    headers: {
      'X-API-KEY': GLOBAL_CONTROL_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  if (!groupsResponse.ok) {
    throw new Error('Failed to fetch tag groups');
  }

  const groupsData = await groupsResponse.json();
  const existingGroup = groupsData.find(g => g.name === groupName);
  
  if (existingGroup) {
    return existingGroup.id;
  }

  // Create group
  const createResponse = await fetch('https://api.globalcontrol.io/api/ai/tag-groups', {
    method: 'POST',
    headers: {
      'X-API-KEY': GLOBAL_CONTROL_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: groupName })
  });

  if (!createResponse.ok) {
    throw new Error('Failed to create tag group');
  }

  const newGroup = await createResponse.json();
  return newGroup.id;
}

// Sync a single response to Global Control
async function syncResponseToGlobalControl(response, tagId) {
  // Extract contact info from QuizForma response
  const contactData = extractContactData(response);
  
  if (!contactData.email) {
    throw new Error('No email found in response');
  }

  console.log(`[SYNC] Processing: ${contactData.email}`);

  // Step 1: Create or update contact in Global Control
  const contact = await createOrUpdateContact(contactData);
  
  // Step 2: Fire the tag for this contact
  await fireTag(tagId, contactData.email);
  
  // Step 3: Store quiz response data as custom fields (if supported)
  // Note: This would require custom field setup in Global Control

  return {
    responseId: response.id,
    contactId: contact.id,
    email: contactData.email,
    success: true,
    message: 'Contact synced and tagged'
  };
}

// Extract contact data from QuizForma response
function extractContactData(response) {
  const answers = response.answers || response.responses || {};
  
  // Common field mappings - adjust based on your quiz structure
  return {
    email: findAnswer(answers, ['email', 'Email', 'E-mail', 'email_address']),
    firstName: findAnswer(answers, ['first_name', 'firstName', 'First Name', 'firstname']),
    lastName: findAnswer(answers, ['last_name', 'lastName', 'Last Name', 'lastname']),
    phone: findAnswer(answers, ['phone', 'Phone', 'phone_number', 'telephone']),
    // Store full response data for reference
    quizResponse: JSON.stringify(answers),
    source: 'LifeCharter Incubator Registration',
    registrationDate: response.created_at || response.submitted_at
  };
}

// Helper to find answer by possible field names
function findAnswer(answers, possibleKeys) {
  for (const key of possibleKeys) {
    if (answers[key]) {
      return answers[key];
    }
    // Try lowercase key
    const lowerKey = key.toLowerCase();
    for (const answerKey of Object.keys(answers)) {
      if (answerKey.toLowerCase() === lowerKey) {
        return answers[answerKey];
      }
    }
  }
  return null;
}

// Create or update contact in Global Control
async function createOrUpdateContact(contactData) {
  // First, check if contact exists
  const searchResponse = await fetch(`https://api.globalcontrol.io/api/ai/contacts?email=${encodeURIComponent(contactData.email)}`, {
    method: 'GET',
    headers: {
      'X-API-KEY': GLOBAL_CONTROL_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  let contactId = null;
  
  if (searchResponse.ok) {
    const contacts = await searchResponse.json();
    if (contacts && contacts.length > 0) {
      contactId = contacts[0].id;
    }
  }

  const payload = {
    email: contactData.email,
    firstName: contactData.firstName || '',
    lastName: contactData.lastName || '',
    phone: contactData.phone || ''
  };

  if (contactId) {
    // Update existing contact
    const updateResponse = await fetch(`https://api.globalcontrol.io/api/ai/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'X-API-KEY': GLOBAL_CONTROL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update contact');
    }

    return await updateResponse.json();
  } else {
    // Create new contact
    const createResponse = await fetch('https://api.globalcontrol.io/api/ai/contacts', {
      method: 'POST',
      headers: {
        'X-API-KEY': GLOBAL_CONTROL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Failed to create contact: ${error}`);
    }

    return await createResponse.json();
  }
}

// Fire a tag for a contact
async function fireTag(tagId, email) {
  const response = await fetch(`https://api.globalcontrol.io/api/ai/tags/fire-tag/${tagId}`, {
    method: 'POST',
    headers: {
      'X-API-KEY': GLOBAL_CONTROL_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fire tag: ${error}`);
  }

  return await response.json();
}