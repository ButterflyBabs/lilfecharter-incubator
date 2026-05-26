// LifeCharter Alignment Snapshot - Global Control CRM Integration
// Pushes contact and assessment data to Global Control CRM

const GLOBAL_CONTROL_API_KEY = process.env.GLOBAL_CONTROL_API_KEY;
const GLOBAL_CONTROL_API_URL = 'https://api.globalcontrol.io/api/ai';

export default async function handler(req, res) {
  // CORS headers
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
    const {
      user_profile,
      score_summary,
      dimension_scores,
      primary_alignment_pattern,
      recommended_pathway,
      crm_tags,
      source_url,
      utm_params
    } = req.body;

    if (!user_profile || !user_profile.email) {
      return res.status(400).json({ error: 'Missing user profile or email' });
    }

    // Build contact data for Global Control CRM
    const contactData = {
      // Basic contact info
      firstName: user_profile.first_name,
      email: user_profile.email,
      phone: user_profile.phone || '',
      
      // Source tracking
      source: 'LifeCharter Alignment Snapshot',
      source_url: source_url || '',
      utm_source: utm_params?.utm_source || '',
      utm_medium: utm_params?.utm_medium || '',
      utm_campaign: utm_params?.utm_campaign || '',
      
      // Assessment data - stored as custom fields
      customFields: {
        // Overall scores
        alignment_snapshot_completed: true,
        alignment_snapshot_date: new Date().toISOString(),
        overall_alignment_score: score_summary.overall_alignment_score,
        overall_alignment_level: score_summary.overall_alignment_level,
        alignment_gap_score: score_summary.alignment_gap_score,
        readiness_level: score_summary.readiness_level,
        
        // Primary pattern
        primary_alignment_pattern: primary_alignment_pattern.pattern_name,
        pattern_confidence: primary_alignment_pattern.confidence,
        pattern_summary: primary_alignment_pattern.pattern_summary,
        pattern_supportive_truth: primary_alignment_pattern.supportive_truth,
        pattern_risk_if_ignored: primary_alignment_pattern.risk_if_ignored,
        pattern_next_step: primary_alignment_pattern.pattern_next_step,
        
        // Recommended offer
        recommended_offer: recommended_pathway.offer_name,
        recommended_offer_reason: recommended_pathway.offer_reason,
        recommended_cta_url: recommended_pathway.cta_url,
        recommended_cta_label: recommended_pathway.cta_label,
        sales_tone: recommended_pathway.sales_tone,
        
        // Dimension scores (all 12)
        ...buildDimensionFields(dimension_scores),
        
        // Top and bottom dimensions
        top_aligned_dimension_1: dimension_scores.find(d => d.rank_from_lowest === 12)?.dimension_name || '',
        top_aligned_dimension_1_score: dimension_scores.find(d => d.rank_from_lowest === 12)?.score || 0,
        top_aligned_dimension_2: dimension_scores.find(d => d.rank_from_lowest === 11)?.dimension_name || '',
        top_aligned_dimension_2_score: dimension_scores.find(d => d.rank_from_lowest === 11)?.score || 0,
        top_aligned_dimension_3: dimension_scores.find(d => d.rank_from_lowest === 10)?.dimension_name || '',
        top_aligned_dimension_3_score: dimension_scores.find(d => d.rank_from_lowest === 10)?.score || 0,
        top_misaligned_dimension_1: dimension_scores.find(d => d.rank_from_lowest === 1)?.dimension_name || '',
        top_misaligned_dimension_1_score: dimension_scores.find(d => d.rank_from_lowest === 1)?.score || 0,
        top_misaligned_dimension_2: dimension_scores.find(d => d.rank_from_lowest === 2)?.dimension_name || '',
        top_misaligned_dimension_2_score: dimension_scores.find(d => d.rank_from_lowest === 2)?.score || 0,
        top_misaligned_dimension_3: dimension_scores.find(d => d.rank_from_lowest === 3)?.dimension_name || '',
        top_misaligned_dimension_3_score: dimension_scores.find(d => d.rank_from_lowest === 3)?.score || 0,
        
        // Full report content (for future reference and support)
        report_opening_reflection: req.body.report_sections?.opening_reflection || '',
        report_overall_interpretation: req.body.report_sections?.overall_interpretation || '',
        report_strengths_summary: req.body.report_sections?.strengths_summary || '',
        report_misalignment_summary: req.body.report_sections?.misalignment_summary || '',
        report_next_faithful_step: req.body.report_sections?.next_faithful_step || '',
        report_closing_encouragement: req.body.report_sections?.closing_encouragement || '',
        report_disclaimer: req.body.report_sections?.disclaimer || '',
        
        // Yellow Yield practice
        yellow_yield_step_1: req.body.report_sections?.yellow_yield_practice?.[0]?.instruction || '',
        yellow_yield_step_2: req.body.report_sections?.yellow_yield_practice?.[1]?.instruction || '',
        yellow_yield_step_3: req.body.report_sections?.yellow_yield_practice?.[2]?.instruction || '',
        yellow_yield_step_4: req.body.report_sections?.yellow_yield_practice?.[3]?.instruction || '',
        yellow_yield_step_5: req.body.report_sections?.yellow_yield_practice?.[4]?.instruction || '',
        yellow_yield_step_6: req.body.report_sections?.yellow_yield_practice?.[5]?.instruction || '',
        
        // Insights
        alignment_gap_interpretation: req.body.insights?.alignment_gap_interpretation || '',
        core_invitation: req.body.insights?.core_invitation || '',
        
        // Safety flags
        crisis_language_detected: req.body.safety_flags?.crisis_language_detected || false,
        safety_note: req.body.safety_flags?.safety_note || '',
        
        // Full report JSON (for complete record)
        full_report_json: JSON.stringify({
          score_summary,
          dimension_scores,
          primary_alignment_pattern,
          recommended_pathway,
          insights: req.body.insights,
          report_sections: req.body.report_sections,
          safety_flags: req.body.safety_flags,
          generated_at: new Date().toISOString()
        })
      },
      
      // Tags for segmentation - always include "snapshot" tag
      tags: [...(crm_tags || buildDefaultTags(score_summary, primary_alignment_pattern, recommended_pathway)), "snapshot"]
    };

    // Send to Global Control CRM
    const response = await fetch(`${GLOBAL_CONTROL_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': GLOBAL_CONTROL_API_KEY
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Global Control CRM error:', errorText);
      throw new Error(`CRM API error: ${response.status}`);
    }

    const crmResponse = await response.json();

    // Also trigger workflow if configured
    const workflowTriggered = await triggerWorkflow(user_profile.email, recommended_pathway.offer_name);

    return res.status(200).json({
      success: true,
      contact_id: crmResponse.id || crmResponse.contact_id,
      message: 'Contact synced to Global Control CRM',
      workflow_triggered: workflowTriggered
    });

  } catch (error) {
    console.error('Error syncing to CRM:', error);
    return res.status(500).json({
      error: 'Failed to sync to CRM',
      message: error.message
    });
  }
}

function buildDimensionFields(dimensionScores) {
  const fields = {};
  dimensionScores.forEach(dim => {
    const fieldName = dim.dimension_id.toLowerCase().replace(/\s+/g, '_') + '_score';
    fields[fieldName] = dim.score;
    fields[fieldName + '_level'] = dim.alignment_level;
  });
  return fields;
}

function buildDefaultTags(scoreSummary, pattern, pathway) {
  const tags = [
    'snapshot',
    'Alignment Snapshot Completed',
    `Alignment Level: ${scoreSummary.overall_alignment_level}`,
    `Primary Pattern: ${pattern.pattern_name}`,
    `Recommended Offer: ${pathway.offer_name}`
  ];

  // Add readiness level tag
  if (scoreSummary.readiness_level) {
    tags.push(`Readiness: ${scoreSummary.readiness_level}`);
  }

  return tags;
}

async function triggerWorkflow(email, offerName) {
  try {
    // Map offer names to workflow IDs (configure these in your Global Control account)
    const workflowMap = {
      'LifeCharter Summit': process.env.WORKFLOW_SUMMIT_ID,
      'LifeCharter Incubator': process.env.WORKFLOW_INCUBATOR_ID,
      'LifeCharter Circle': process.env.WORKFLOW_CIRCLE_ID,
      'LifeCharter Conversation': process.env.WORKFLOW_CONVERSATION_ID
    };

    const workflowId = workflowMap[offerName];
    if (!workflowId) {
      console.log('No workflow configured for:', offerName);
      return false;
    }

    const response = await fetch(`${GLOBAL_CONTROL_API_URL}/workflows/${workflowId}/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GLOBAL_CONTROL_API_KEY}`
      },
      body: JSON.stringify({
        contact_email: email,
        trigger_data: {
          source: 'Alignment Snapshot',
          timestamp: new Date().toISOString()
        }
      })
    });

    return response.ok;

  } catch (error) {
    console.error('Error triggering workflow:', error);
    return false;
  }
}