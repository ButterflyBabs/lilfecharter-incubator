# LifeCharter Alignment Snapshot

A web-based diagnostic assessment and AI-generated personalized report for the LifeCharter ecosystem.

## Overview

The LifeCharter Alignment Snapshot helps visitors identify where they feel aligned, strained, unclear, or misaligned across the 12 Dimensions of LifeCharter. Users complete a 36-question assessment and receive:

- Overall alignment score (0-100)
- Red/Yellow/Green Light season indicator
- 12-dimension visual breakdown
- Top 3 aligned and misaligned dimensions
- AI-generated personalized report
- Primary alignment pattern
- Next faithful step
- Recommended LifeCharter pathway

## 12 LifeCharter Dimensions

1. My Quality of Life
2. My Character
3. My Intellectual Life
4. My Emotional Life
5. My Health and Fitness
6. My Love Relationships
7. My Parenting
8. My Career
9. My Spiritual Life
10. My Social Life
11. My Financial Life
12. My Life Vision

## Features

- ✅ 36-question assessment (3 per dimension)
- ✅ Scoring engine with Red/Yellow/Green Light levels
- ✅ AI-generated personalized report via OpenAI GPT-4o
- ✅ 7 alignment pattern detection
- ✅ Visual dimension chart
- ✅ Email capture and CRM integration ready
- ✅ Mobile responsive design
- ✅ Brand-aligned styling (Sacred Kaleidoscope colors)

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI**: OpenAI GPT-4o with JSON Schema
- **Hosting**: Vercel
- **CRM**: GoHighLevel (integration ready)

## File Structure

```
lifecharter-alignment-snapshot/
├── index.html              # Main application
├── app.js                  # Frontend logic
├── api/
│   └── generate-report.js  # OpenAI API endpoint
├── package.json
├── vercel.json
├── .env.example
└── README.md
```

## Deployment Instructions

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key
```

### 3. Deploy to Vercel

```bash
vercel
```

Follow the prompts to link to your Vercel account.

### 4. Add environment variables in Vercel Dashboard

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add `OPENAI_API_KEY` with your actual OpenAI API key
4. Redeploy if needed

### 5. Set up custom domain (optional)

```bash
vercel domains add alignment.amilynnecarroll.com
```

## GoHighLevel Integration

To connect with GoHighLevel:

1. Get your GoHighLevel API key
2. Add `GHL_API_KEY` and `GHL_LOCATION_ID` to environment variables
3. Uncomment and configure the `sendToCRM()` function in `app.js`

## AI Report Generation

The AI report uses OpenAI's GPT-4o with structured JSON output. The system prompt is designed to:

- Use compassionate, metaphysical, practical language
- Avoid clinical diagnosis or therapy language
- Not promise specific outcomes
- Include Yellow Yield practice (6 steps)
- Generate personalized next steps
- Route to appropriate LifeCharter offer

## Alignment Patterns

The system detects 7 primary alignment patterns:

1. **The Overextended Giver** - Showing up for others while neglecting self
2. **The Sacred Drifter** - Spiritual sensitivity without practical structure
3. **The Quiet Achiever** - Capable but disconnected from deeper fulfillment
4. **The Survival Strategist** - Operating from endurance rather than alignment
5. **The Disconnected Visionary** - Clear vision but struggle with embodiment
6. **The Relationship-Tethered Traveler** - Growing internally while navigating relational strain
7. **The Purpose-Ready Butterfly** - Ready for refinement and expanded action

## Scoring

- **Dimension Score**: Average of 3 questions ÷ 5 × 100
- **Overall Score**: Average of all 12 dimension scores
- **Red Light**: 0-39 (needs immediate care)
- **Yellow Light**: 40-69 (sacred pause, realignment)
- **Green Light**: 70-100 (ready for refinement)

## License

Proprietary - Sacred Kaleidoscope Community LLC

## Contact

AmiLynne "Babs" Carroll
Sacred Kaleidoscope Community
https://amilynnecarroll.com