// LifeCharter Alignment Snapshot - AI Report Generation API
// OpenAI API integration with structured JSON output

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
      open_reflections,
      offer_routing
    } = req.body;

    // Build the AI prompt - streamlined for faster processing
    const systemPrompt = `You are the LifeCharter Alignment Snapshot Guide. Create a compassionate, spiritually grounded report from assessment data.

VOICE: Warm, grounded, metaphysical, practical. Invitational not forceful. Direct without shaming.

CORE PHILOSOPHY:
- Alignment = returning to truth, not perfection
- Red Light (0-39) = asking for care, not failure
- Yellow Light (40-69) = sacred pause, transformation begins here
- Green Light (70-100) = already taking root

RULES:
1. Use provided scores exactly - never recalculate
2. Return ONLY valid JSON matching schema
3. No markdown, code fences, or extra text
4. Use cautious language: "may suggest," "appears to," "your answers point toward"
5. No clinical diagnosis, income promises, or outcome guarantees
6. If crisis language detected, set safety_flags.crisis_language_detected=true and pathway="Immediate Support"
7. Preserve exact LifeCharter Dimension names

LENGTH LIMITS:
- Opening: 120-180 words
- Overall interpretation: 80-140 words
- Strengths: 80-140 words
- Misalignment: 100-170 words
- Pattern explanation: 120-180 words
- Yellow Yield: exactly 6 steps (YIELD, EXHALE, LOCATE, LISTEN, OWN, WALK)
- Next step: one 24-hour action
- Pathway reason: 60-120 words
- Closing: 60-110 words

12 DIMENSIONS: Quality of Life, Character, Intellectual Life, Emotional Life, Health and Fitness, Love Relationships, Parenting, Career, Spiritual Life, Social Life, Financial Life, Life Vision

ALIGNMENT LEVELS: Red Light (0-39), Yellow Light (40-69), Green Light (70-100)

PATTERNS:
- Overextended Giver: Low Emotional/Health/Quality; High Love/Parenting/Social/Character
- Sacred Drifter: Low Vision/Career/Financial; Moderate+ Spiritual
- Quiet Achiever: High Career/Character/Intellectual; Low Emotional/Quality/Spiritual/Love
- Survival Strategist: Low Quality/Emotional/Financial/Health; Moderate Character/Spiritual
- Disconnected Visionary: High Vision/Spiritual; Low Career/Financial/Health/Quality
- Relationship-Tethered: Low Love/Parenting/Social; Moderate+ Character/Spiritual/Emotional
- Purpose-Ready Butterfly: Moderate+ overall; strong Vision/Spiritual/Character; some Yellow areas

PATHWAYS:
- Summit (Red Light): https://amilynnecarroll.com/summit
- Incubator (Yellow Light): https://lifecharter-incubator.vercel.app/
- Circle (Green Light): https://life-charter.vercel.app/
- Self-Directed: https://amilynnecarroll.com/self-directed
- Conversation: https://amilynnecarroll.com/conversation
- 21 Day Challenge: https://amilynnecarroll.com/21-day-challenge
- Conversations: https://amilynnecarroll.com/conversations-of-consequence
- Immediate Support (crisis): https://amilynnecarroll.com/support`;


    const userPrompt = `Generate LifeCharter report from this data:

USER: ${JSON.stringify(user_profile)}
SCORES: ${JSON.stringify(score_summary)}
DIMENSIONS: ${JSON.stringify(dimension_scores)}
REFLECTIONS: ${JSON.stringify(open_reflections || {})}
ROUTING: ${JSON.stringify(offer_routing)}

Return ONLY valid JSON matching the schema.`;

    // JSON Schema for structured output
    const jsonSchema = {
      type: "object",
      additionalProperties: false,
      required: [
        "snapshot_version",
        "generated_at",
        "user",
        "score_summary",
        "dimension_results",
        "insights",
        "primary_alignment_pattern",
        "report_sections",
        "recommended_pathway",
        "email_report",
        "crm",
        "safety_flags"
      ],
      properties: {
        snapshot_version: { type: "string", const: "1.0" },
        generated_at: { type: "string" },
        user: {
          type: "object",
          additionalProperties: false,
          required: ["first_name", "email", "completion_date"],
          properties: {
            first_name: { type: "string" },
            email: { type: "string" },
            completion_date: { type: "string" }
          }
        },
        score_summary: {
          type: "object",
          additionalProperties: false,
          required: ["overall_alignment_score", "overall_alignment_level", "alignment_gap_score", "readiness_level"],
          properties: {
            overall_alignment_score: { type: "integer", minimum: 0, maximum: 100 },
            overall_alignment_level: { type: "string", enum: ["Red Light", "Yellow Light", "Green Light"] },
            alignment_gap_score: { type: "integer", minimum: 0, maximum: 100 },
            readiness_level: { type: "string", enum: ["Stabilize", "Realign", "Refine", "Expand"] }
          }
        },
        dimension_results: {
          type: "array",
          minItems: 12,
          maxItems: 12,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["dimension_id", "dimension_name", "score", "alignment_level", "rank_from_lowest", "interpretation", "micro_step"],
            properties: {
              dimension_id: { type: "string" },
              dimension_name: { type: "string" },
              score: { type: "integer", minimum: 0, maximum: 100 },
              alignment_level: { type: "string", enum: ["Red Light", "Yellow Light", "Green Light"] },
              rank_from_lowest: { type: "integer", minimum: 1, maximum: 12 },
              interpretation: { type: "string", minLength: 40, maxLength: 500 },
              micro_step: { type: "string", minLength: 20, maxLength: 260 }
            }
          }
        },
        insights: {
          type: "object",
          additionalProperties: false,
          required: ["top_aligned_dimensions", "top_misaligned_dimensions", "alignment_gap_interpretation", "core_invitation"],
          properties: {
            top_aligned_dimensions: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
            top_misaligned_dimensions: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
            alignment_gap_interpretation: { type: "string", minLength: 40, maxLength: 500 },
            core_invitation: { type: "string", minLength: 40, maxLength: 360 }
          }
        },
        primary_alignment_pattern: {
          type: "object",
          additionalProperties: false,
          required: ["pattern_name", "confidence", "pattern_summary", "supportive_truth", "risk_if_ignored", "pattern_next_step"],
          properties: {
            pattern_name: { type: "string", enum: ["The Overextended Giver", "The Sacred Drifter", "The Quiet Achiever", "The Survival Strategist", "The Disconnected Visionary", "The Relationship-Tethered Traveler", "The Purpose-Ready Butterfly"] },
            confidence: { type: "string", enum: ["Low", "Moderate", "High"] },
            pattern_summary: { type: "string", minLength: 80, maxLength: 900 },
            supportive_truth: { type: "string", minLength: 20, maxLength: 220 },
            risk_if_ignored: { type: "string", minLength: 40, maxLength: 400 },
            pattern_next_step: { type: "string", minLength: 20, maxLength: 280 }
          }
        },
        report_sections: {
          type: "object",
          additionalProperties: false,
          required: ["opening_reflection", "overall_interpretation", "strengths_summary", "misalignment_summary", "yellow_yield_practice", "next_faithful_step", "closing_encouragement", "disclaimer"],
          properties: {
            opening_reflection: { type: "string", minLength: 300, maxLength: 1200 },
            overall_interpretation: { type: "string", minLength: 160, maxLength: 800 },
            strengths_summary: { type: "string", minLength: 160, maxLength: 800 },
            misalignment_summary: { type: "string", minLength: 200, maxLength: 1000 },
            yellow_yield_practice: {
              type: "array",
              minItems: 6,
              maxItems: 6,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["step", "instruction"],
                properties: {
                  step: { type: "string", enum: ["YIELD", "EXHALE", "LOCATE", "LISTEN", "OWN", "WALK"] },
                  instruction: { type: "string", minLength: 20, maxLength: 220 }
                }
              }
            },
            next_faithful_step: { type: "string", minLength: 30, maxLength: 360 },
            closing_encouragement: { type: "string", minLength: 120, maxLength: 700 },
            disclaimer: { type: "string", minLength: 80, maxLength: 500 }
          }
        },
        recommended_pathway: {
          type: "object",
          additionalProperties: false,
          required: ["offer_name", "offer_reason", "cta_label", "cta_url", "sales_tone"],
          properties: {
            offer_name: { type: "string", enum: ["LifeCharter Summit", "LifeCharter Incubator", "Self-Directed LifeCharter", "LifeCharter Circle", "LifeCharter Conversation", "Immediate Support"] },
            offer_reason: { type: "string", minLength: 120, maxLength: 800 },
            cta_label: { type: "string", minLength: 5, maxLength: 80 },
            cta_url: { type: "string" },
            sales_tone: { type: "string", enum: ["Gentle support", "Invitation", "Direct invitation", "No sales CTA"] }
          }
        },
        email_report: {
          type: "object",
          additionalProperties: false,
          required: ["subject", "preview_text", "body_plain_text"],
          properties: {
            subject: { type: "string", minLength: 10, maxLength: 80 },
            preview_text: { type: "string", minLength: 20, maxLength: 140 },
            body_plain_text: { type: "string", minLength: 600, maxLength: 6000 }
          }
        },
        crm: {
          type: "object",
          additionalProperties: false,
          required: ["tags"],
          properties: {
            tags: { type: "array", items: { type: "string" } }
          }
        },
        safety_flags: {
          type: "object",
          additionalProperties: false,
          required: ["crisis_language_detected", "medical_claim_risk", "financial_advice_risk", "relationship_safety_risk", "safety_note"],
          properties: {
            crisis_language_detected: { type: "boolean" },
            medical_claim_risk: { type: "boolean" },
            financial_advice_risk: { type: "boolean" },
            relationship_safety_risk: { type: "boolean" },
            safety_note: { type: "string", minLength: 20, maxLength: 500 }
          }
        }
      }
    };

    // Call OpenAI API with timeout and optimized settings
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'lifecharter_alignment_snapshot_report',
            schema: jsonSchema,
            strict: true
          }
        },
        temperature: 0.5,
        max_tokens: 3500
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const report = JSON.parse(data.choices[0].message.content);

    return res.status(200).json(report);

  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ 
      error: 'Failed to generate report',
      message: error.message 
    });
  }
}