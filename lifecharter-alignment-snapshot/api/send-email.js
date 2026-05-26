// LifeCharter Alignment Snapshot - Email Report Delivery
// Sends the AI-generated report to the participant's email

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'babs@amilynnecarroll.com';

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
    const { to_email, first_name, ai_report } = req.body;

    if (!to_email || !ai_report) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build email content from AI report
    const subject = ai_report.email_report?.subject || `Your LifeCharter Alignment Snapshot is ready, ${first_name}`;
    
    const htmlContent = buildEmailHTML(first_name, ai_report);
    const textContent = ai_report.email_report?.body_plain_text || buildEmailText(first_name, ai_report);

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: `Babs at LifeCharter <${FROM_EMAIL}>`,
        to: to_email,
        subject: subject,
        html: htmlContent,
        text: textContent
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      throw new Error('Failed to send email');
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      messageId: data.id,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message
    });
  }
}

function buildEmailHTML(firstName, report) {
  const sections = report.report_sections;
  const pattern = report.primary_alignment_pattern;
  const pathway = report.recommended_pathway;
  const score = report.score_summary;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your LifeCharter Alignment Snapshot</title>
  <style>
    body { font-family: 'Open Sans', sans-serif; line-height: 1.6; color: #2F312F; background: #F5F1E8; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #F5F1E8 0%, #DAD2B9 100%); padding: 40px; text-align: center; border-bottom: 2px solid #C4B792; }
    .header h1 { font-family: 'EB Garamond', serif; color: #2F312F; margin: 0; font-size: 28px; }
    .header .tagline { color: #8F8875; font-style: italic; margin-top: 10px; }
    .content { padding: 40px; }
    .score-section { text-align: center; padding: 30px; background: #F5F1E8; border-radius: 8px; margin-bottom: 30px; }
    .score { font-size: 48px; font-weight: bold; color: #CBA488; }
    .score-label { font-size: 14px; color: #8F8875; text-transform: uppercase; letter-spacing: 2px; }
    .alignment-level { font-size: 24px; font-weight: 600; margin-top: 10px; }
    .red { color: #C4706A; }
    .yellow { color: #D4A853; }
    .green { color: #7A9E7E; }
    .section { margin-bottom: 30px; }
    .section h2 { font-family: 'EB Garamond', serif; color: #2F312F; border-bottom: 2px solid #DAD2B9; padding-bottom: 10px; margin-bottom: 20px; }
    .section h3 { color: #CBA488; margin-bottom: 15px; }
    .pattern-box { background: #F5F1E8; padding: 20px; border-radius: 8px; border-left: 4px solid #CBA488; }
    .next-step { background: #CBA488; color: white; padding: 20px; border-radius: 8px; margin: 30px 0; }
    .cta { text-align: center; padding: 30px; background: #F5F1E8; }
    .cta a { display: inline-block; background: #CBA488; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #8F8875; border-top: 1px solid #DAD2B9; }
    .disclaimer { font-size: 11px; color: #8F8875; font-style: italic; padding: 20px; background: #F5F1E8; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🦋 Your LifeCharter Alignment Snapshot</h1>
      <div class="tagline">Prepared for ${firstName}</div>
    </div>
    
    <div class="content">
      <div class="score-section">
        <div class="score-label">Your Alignment Score</div>
        <div class="score">${score.overall_alignment_score}</div>
        <div class="alignment-level ${score.overall_alignment_level.toLowerCase().replace(' ', '-')}">${score.overall_alignment_level} Season</div>
      </div>

      <div class="section">
        <h2>${sections.opening_reflection.split('.')[0]}.</h2>
        <p>${sections.opening_reflection}</p>
      </div>

      <div class="section">
        <h2>Your Alignment Pattern</h2>
        <div class="pattern-box">
          <h3>${pattern.pattern_name}</h3>
          <p>${pattern.pattern_summary}</p>
          <p><strong>Supportive Truth:</strong> ${pattern.supportive_truth}</p>
        </div>
      </div>

      <div class="section">
        <h2>Your Next Faithful Step</h2>
        <div class="next-step">
          <p>${sections.next_faithful_step}</p>
        </div>
      </div>

      <div class="cta">
        <h3>Continue Your Alignment Journey</h3>
        <p>${pathway.offer_reason}</p>
        <a href="${pathway.cta_url}">${pathway.cta_label}</a>
      </div>

      <div class="section">
        <h2>Other Pathways to Explore</h2>
        <p>Based on your Snapshot, you may also find value in these additional resources:</p>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 15px 0; padding: 15px; background: #F5F1E8; border-radius: 8px;">
            <strong>🦋 LifeCharter Incubator</strong><br>
            A guided 90-minute workshop to begin your alignment journey.<br>
            <a href="https://lifecharter-incubator.vercel.app/" style="color: #CBA488; text-decoration: none; font-weight: 600;">Register Free →</a>
          </li>
          <li style="margin: 15px 0; padding: 15px; background: #F5F1E8; border-radius: 8px;">
            <strong>🎯 LifeCharter Circle</strong><br>
            Ongoing coaching and community for deeper transformation.<br>
            <a href="https://life-charter.vercel.app/" style="color: #CBA488; text-decoration: none; font-weight: 600;">Learn More →</a>
          </li>
          <li style="margin: 15px 0; padding: 15px; background: #F5F1E8; border-radius: 8px;">
            <strong>📅 21 Day Challenge</strong><br>
            Daily alignment practices to build momentum.<br>
            <a href="https://amilynnecarroll.com/21-day-challenge" style="color: #CBA488; text-decoration: none; font-weight: 600;">Start Challenge →</a>
          </li>
          <li style="margin: 15px 0; padding: 15px; background: #F5F1E8; border-radius: 8px;">
            <strong>💬 Conversations of Consequence</strong><br>
            Ongoing teachings, articles, and reflections.<br>
            <a href="https://amilynnecarroll.com/conversations-of-consequence" style="color: #CBA488; text-decoration: none; font-weight: 600;">Read Articles →</a>
          </li>
        </ul>
      </div>

      <div class="disclaimer">
        ${sections.disclaimer}
      </div>
    </div>

    <div class="footer">
      <p>© Sacred Kaleidoscope Community | AmiLynne "Babs" Carroll</p>
      <p><a href="https://amilynnecarroll.com">amilynnecarroll.com</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

function buildEmailText(firstName, report) {
  const sections = report.report_sections;
  const pattern = report.primary_alignment_pattern;
  const pathway = report.recommended_pathway;
  const score = report.score_summary;

  return `
Your LifeCharter Alignment Snapshot
Prepared for ${firstName}

Your Alignment Score: ${score.overall_alignment_score}
Alignment Level: ${score.overall_alignment_level}

${sections.opening_reflection}

YOUR ALIGNMENT PATTERN: ${pattern.pattern_name}

${pattern.pattern_summary}

Supportive Truth: ${pattern.supportive_truth}

YOUR NEXT FAITHFUL STEP:
${sections.next_faithful_step}

CONTINUE YOUR ALIGNMENT JOURNEY:
${pathway.offer_reason}

${pathway.cta_label}: ${pathway.cta_url}

OTHER PATHWAYS TO EXPLORE:

🦋 LifeCharter Incubator
A guided 90-minute workshop to begin your alignment journey.
Register Free: https://lifecharter-incubator.vercel.app/

🎯 LifeCharter Circle
Ongoing coaching and community for deeper transformation.
Learn More: https://life-charter.vercel.app/

📅 21 Day Challenge
Daily alignment practices to build momentum.
Start Challenge: https://amilynnecarroll.com/21-day-challenge

💬 Conversations of Consequence
Ongoing teachings, articles, and reflections.
Read Articles: https://amilynnecarroll.com/conversations-of-consequence

---
${sections.disclaimer}

© Sacred Kaleidoscope Community | AmiLynne "Babs" Carroll
https://amilynnecarroll.com
  `;
}