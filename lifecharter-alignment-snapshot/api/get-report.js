// LifeCharter Alignment Snapshot - Retrieve Saved Report
// For future reference and support purposes

const GLOBAL_CONTROL_API_KEY = process.env.GLOBAL_CONTROL_API_KEY;
const GLOBAL_CONTROL_API_URL = process.env.GLOBAL_CONTROL_API_URL || 'https://api.globalcontrolcrm.com/v1';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authorization (you may want to add JWT or API key validation here)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { email, contact_id } = req.query;

    if (!email && !contact_id) {
      return res.status(400).json({ error: 'Email or contact_id required' });
    }

    // Search for contact in Global Control CRM
    let contact;
    
    if (contact_id) {
      // Get by contact ID
      const response = await fetch(`${GLOBAL_CONTROL_API_URL}/contacts/${contact_id}`, {
        headers: {
          'Authorization': `Bearer ${GLOBAL_CONTROL_API_KEY}`,
          'X-API-Version': 'v1'
        }
      });

      if (!response.ok) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      contact = await response.json();
    } else {
      // Search by email
      const response = await fetch(`${GLOBAL_CONTROL_API_URL}/contacts?email=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${GLOBAL_CONTROL_API_KEY}`,
          'X-API-Version': 'v1'
        }
      });

      if (!response.ok) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      const data = await response.json();
      contact = data.contacts?.[0] || data;
    }

    // Extract report data from custom fields
    const customFields = contact.custom_fields || {};
    
    // Parse the full report JSON if it exists
    let fullReport = null;
    try {
      if (customFields.full_report_json) {
        fullReport = JSON.parse(customFields.full_report_json);
      }
    } catch (e) {
      console.error('Error parsing full report JSON:', e);
    }

    // Build report summary
    const reportSummary = {
      contact_id: contact.id,
      first_name: contact.first_name,
      email: contact.email,
      phone: contact.phone,
      
      // Assessment metadata
      assessment: {
        completed: customFields.alignment_snapshot_completed,
        date: customFields.alignment_snapshot_date,
        overall_score: customFields.overall_alignment_score,
        overall_level: customFields.overall_alignment_level,
        alignment_gap: customFields.alignment_gap_score,
        readiness_level: customFields.readiness_level
      },
      
      // Pattern
      pattern: {
        name: customFields.primary_alignment_pattern,
        confidence: customFields.pattern_confidence,
        summary: customFields.pattern_summary,
        supportive_truth: customFields.pattern_supportive_truth,
        risk_if_ignored: customFields.pattern_risk_if_ignored,
        next_step: customFields.pattern_next_step
      },
      
      // Recommended pathway
      pathway: {
        offer: customFields.recommended_offer,
        offer_reason: customFields.recommended_offer_reason,
        cta_label: customFields.recommended_cta_label,
        cta_url: customFields.recommended_cta_url,
        sales_tone: customFields.sales_tone
      },
      
      // Dimensions
      dimensions: {
        scores: extractDimensionScores(customFields),
        top_aligned: [
          { name: customFields.top_aligned_dimension_1, score: customFields.top_aligned_dimension_1_score },
          { name: customFields.top_aligned_dimension_2, score: customFields.top_aligned_dimension_2_score },
          { name: customFields.top_aligned_dimension_3, score: customFields.top_aligned_dimension_3_score }
        ].filter(d => d.name),
        top_misaligned: [
          { name: customFields.top_misaligned_dimension_1, score: customFields.top_misaligned_dimension_1_score },
          { name: customFields.top_misaligned_dimension_2, score: customFields.top_misaligned_dimension_2_score },
          { name: customFields.top_misaligned_dimension_3, score: customFields.top_misaligned_dimension_3_score }
        ].filter(d => d.name)
      },
      
      // Report content
      report_content: {
        opening_reflection: customFields.report_opening_reflection,
        overall_interpretation: customFields.report_overall_interpretation,
        strengths_summary: customFields.report_strengths_summary,
        misalignment_summary: customFields.report_misalignment_summary,
        next_faithful_step: customFields.report_next_faithful_step,
        closing_encouragement: customFields.report_closing_encouragement,
        disclaimer: customFields.report_disclaimer,
        
        // Yellow Yield practice
        yellow_yield_practice: [
          customFields.yellow_yield_step_1,
          customFields.yellow_yield_step_2,
          customFields.yellow_yield_step_3,
          customFields.yellow_yield_step_4,
          customFields.yellow_yield_step_5,
          customFields.yellow_yield_step_6
        ].filter(Boolean),
        
        // Insights
        alignment_gap_interpretation: customFields.alignment_gap_interpretation,
        core_invitation: customFields.core_invitation
      },
      
      // Safety flags
      safety_flags: {
        crisis_language_detected: customFields.crisis_language_detected,
        safety_note: customFields.safety_note
      },
      
      // Full report (if available)
      full_report: fullReport,
      
      // Source tracking
      source: {
        source_url: customFields.source_url,
        utm_source: customFields.utm_source,
        utm_medium: customFields.utm_medium,
        utm_campaign: customFields.utm_campaign
      },
      
      // Tags
      tags: contact.tags || []
    };

    return res.status(200).json(reportSummary);

  } catch (error) {
    console.error('Error retrieving report:', error);
    return res.status(500).json({
      error: 'Failed to retrieve report',
      message: error.message
    });
  }
}

function extractDimensionScores(customFields) {
  const dimensions = [
    'quality_of_life',
    'character',
    'intellectual_life',
    'emotional_life',
    'health_fitness',
    'love_relationships',
    'parenting',
    'career',
    'spiritual_life',
    'social_life',
    'financial_life',
    'life_vision'
  ];

  return dimensions.map(id => ({
    id,
    score: customFields[`${id}_score`] || 0,
    level: customFields[`${id}_score_level`] || ''
  }));
}