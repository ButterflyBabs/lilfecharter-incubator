# LifeCharter Alignment Snapshot
## Build Specifications for Page Sprout + QuizForma
### Chad Nicely Suite Implementation Guide

---

## Project Overview

**Product Name:** LifeCharter Alignment Snapshot  
**Version:** MVP 1.0  
**Platform:** Page Sprout + QuizForma (Chad Nicely Suite)  
**Owner:** AmiLynne "Babs" Carroll, Sacred Kaleidoscope Community  
**Goal:** Create a web-based lead magnet that assesses alignment across 12 LifeCharter Dimensions and routes users to appropriate LifeCharter pathways

---

## Tool Stack

### Primary Tools
- **Page Sprout** - Landing pages, bridge pages, result pages, CTAs
- **QuizForma** - Assessment questions, scoring, lead capture, result categories

### Optional/Integrated Tools
- **Global Control** - Contact management, tags, segments (if available)
- **Letterman** - Email follow-up sequences (if available)
- **AIBot Studio** - AI report generation (if available)
- **OpenClaw Agent** - Data routing, automation support

### Explicitly NOT Used
- ❌ GoHighLevel (per project requirements)

---

## Page Sprout Structure

### Page 1: Landing Page
**URL:** `/alignment-snapshot` or `/snapshot`

**Sections:**
1. **Hero Section**
   - Headline: "Where Is Your Life Asking for Alignment?"
   - Subheadline: "Take the free LifeCharter Alignment Snapshot and discover where overwhelm, drift, or disconnection may be showing up across the 12 Dimensions of your life."
   - CTA Button: "Begin My Free Alignment Snapshot"

2. **What You'll Discover**
   - Where your life currently feels most aligned
   - Where strain, drift, or overwhelm may be showing up
   - Which LifeCharter Dimensions may be asking for deeper attention
   - Your Red, Yellow, or Green Alignment Season
   - One next faithful step toward clarity and aligned action

3. **How It Works**
   - 5-7 minute reflection assessment
   - 12 Dimensions of LifeCharter
   - Personalized Alignment Snapshot
   - Immediate results + email copy

4. **About LifeCharter**
   - Brief description of the 12 Dimensions framework
   - LifeCharter as a lifestyle design and alignment system

5. **About Babs**
   - AmiLynne "Babs" Carroll bio
   - Sacred Kaleidoscope Community
   - Alignment Architect credentials

6. **Privacy Reassurance**
   - "Your information will never be sold."
   - "You'll receive your Snapshot and occasional LifeCharter reflections."
   - "Unsubscribe anytime."

7. **Final CTA**
   - Button: "Begin My Free Alignment Snapshot"
   - Links to: Bridge/Welcome Page

---

### Page 2: Bridge/Welcome Page
**URL:** `/alignment-snapshot/welcome`

**Content:**
- **Headline:** "Welcome to Your Alignment Snapshot"
- **Body Copy:**
  ```
  This is not a test.
  This is not a diagnosis.
  This is a sacred pause.

  You will be invited to reflect on the 12 Dimensions of LifeCharter and notice where your life feels aligned, where it feels strained, and where it may be asking for deeper care.

  Answer from where you are today, not where you think you should be.

  Estimated time: 5-7 minutes
  ```
- **CTA Button:** "Begin the Snapshot"
  - Links to: QuizForma assessment (embedded or new tab)

---

### Page 3: Red Light Result Page
**URL:** `/alignment-snapshot/results/red-light`

**Content:**
- **Headline:** "Your Snapshot Suggests a Red Light Alignment Season"
- **Body Copy:**
  ```
  This does not mean you have failed.

  It means some part of your life may be carrying more strain than it was ever meant to carry alone.

  A Red Light is not punishment. It is a loving invitation to stop, breathe, and receive support before pushing forward.

  Your next step is not to fix everything.
  Your next step is to begin with one honest, supported pause.
  ```
- **Primary CTA:** "Reserve My Free Seat for the LifeCharter Summit"
- **Secondary CTA:** "Join the Next LifeCharter Incubator"

---

### Page 4: Yellow Light Result Page
**URL:** `/alignment-snapshot/results/yellow-light`

**Content:**
- **Headline:** "Your Snapshot Suggests a Yellow Light Alignment Season"
- **Body Copy:**
  ```
  The Yellow Light is where transformation begins.

  It is the place between reaction and choice, between drifting and deciding, between knowing something needs to shift and finally allowing yourself to listen.

  Your life may not be falling apart.
  It may simply be asking you to stop living on automatic.
  ```
- **Primary CTA:** "Join the Next LifeCharter Incubator"
- **Secondary CTA:** "Explore LifeCharter Circle"

---

### Page 5: Green Light Result Page
**URL:** `/alignment-snapshot/results/green-light`

**Content:**
- **Headline:** "Your Snapshot Suggests a Green Light Alignment Season"
- **Body Copy:**
  ```
  A Green Light does not mean your life is perfect.

  It means alignment may already be taking root in meaningful ways.

  Now the invitation may be refinement, structure, and a deeper commitment to the life you are here to live.
  ```
- **Primary CTA:** "Explore LifeCharter Circle"
- **Secondary CTA:** "Book a LifeCharter Conversation"

---

## QuizForma Quiz Structure

### Quiz Settings

**Quiz Name:** LifeCharter Alignment Snapshot  
**Quiz Description:** 12-Dimension assessment for LifeCharter alignment  
**Completion Message:** "Your Snapshot is being prepared..."  
**Redirect After Completion:** Page Sprout result page (based on score)

### Quiz Introduction

**Title:** "LifeCharter Alignment Snapshot"

**Description:**
```
Welcome to your LifeCharter Alignment Snapshot.

You'll be guided through the 12 Dimensions of LifeCharter and invited to notice where your life feels aligned, where it feels stretched, and where it may be asking for deeper attention.

There are no wrong answers.

Answer from where you are today.

Estimated time: 5-7 minutes
```

### Answer Scale (Use for ALL Questions)

| Score | Label | Display Text |
|------:|-------|--------------|
| 1 | Deeply misaligned | "This statement does not feel true in this season" |
| 2 | Strained | "This statement is rarely true or feels difficult to access" |
| 3 | Unclear or inconsistent | "This statement is sometimes true, but not steady" |
| 4 | Mostly aligned | "This statement is generally true and supported" |
| 5 | Deeply aligned | "This statement feels true, embodied, and alive" |

**Scale Type:** 1-5 Rating Scale  
**Point Values:** 1, 2, 3, 4, 5 (direct mapping)

---

### Question Groups (12 Dimensions)

Create one group per dimension. Each group contains 5 questions.

---

#### Group 1: My Quality of Life (QOL)

**Group Description:** This dimension looks at daily lived experience, peace, ease, enjoyment, and whether life feels nourishing instead of only demanding.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | QOL-01 | My daily life includes moments of peace, beauty, or genuine enjoyment. |
| 2 | QOL-02 | I have enough spaciousness in my life to breathe, rest, and be present. |
| 3 | QOL-03 | The way I spend my time reflects what truly matters to me. |
| 4 | QOL-04 | I feel a sense of ownership over my life rather than feeling carried by obligation. |
| 5 | QOL-05 | I can honestly say my life contains more than survival, maintenance, or getting through the day. |

---

#### Group 2: My Character (CHR)

**Group Description:** This dimension looks at integrity, self-honesty, responsibility, consistency, and the way you live in relationship with your own values.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | CHR-01 | My choices generally reflect the values I say matter most to me. |
| 2 | CHR-02 | I am willing to tell myself the truth, even when it is uncomfortable. |
| 3 | CHR-03 | I take responsibility for my next faithful step without collapsing into shame. |
| 4 | CHR-04 | The person I am becoming feels aligned with the person I know I am called to be. |
| 5 | CHR-05 | I can pause before reacting and choose a response that reflects who I truly am. |

---

#### Group 3: My Intellectual Life (INT)

**Group Description:** This dimension looks at curiosity, learning, mental stimulation, thought patterns, and whether you are feeding the mind with life-giving ideas.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | INT-01 | I regularly engage with ideas, learning, or conversations that expand me. |
| 2 | INT-02 | My inner dialogue helps me grow instead of keeping me trapped in old stories. |
| 3 | INT-03 | I am open to seeing things differently when Truth invites me to grow. |
| 4 | INT-04 | I make time to reflect, integrate, and understand what I am experiencing. |
| 5 | INT-05 | The information I consume supports clarity rather than anxiety, comparison, or confusion. |

---

#### Group 4: My Emotional Life (EMO)

**Group Description:** This dimension looks at emotional awareness, regulation, honesty, resilience, and the ability to stay present with feelings without being ruled by them.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | EMO-01 | I can name what I am feeling without judging myself for feeling it. |
| 2 | EMO-02 | I have healthy ways to process disappointment, fear, anger, grief, or uncertainty. |
| 3 | EMO-03 | I do not regularly abandon myself in order to keep the peace. |
| 4 | EMO-04 | When I feel overwhelmed, I can pause and return to choice rather than react automatically. |
| 5 | EMO-05 | I trust that my emotions carry information, but they do not have to become my identity. |

---

#### Group 5: My Health and Fitness (HLT)

**Group Description:** This dimension looks at body stewardship, energy, rest, movement, nourishment, and the relationship between physical care and spiritual alignment.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | HLT-01 | I treat my body as a sacred partner rather than a problem to punish, ignore, or drag behind me. |
| 2 | HLT-02 | My current habits support my energy, strength, rest, and overall wellbeing. |
| 3 | HLT-03 | I listen to my body before it has to speak through exhaustion, pain, or shutdown. |
| 4 | HLT-04 | I have realistic, sustainable practices that help me care for my body in this season. |
| 5 | HLT-05 | I experience my physical wellbeing as connected to my emotional, mental, and spiritual life. |

---

#### Group 6: My Love Relationships (LOV)

**Group Description:** This dimension looks at intimacy, partnership, connection, boundaries, truth-telling, trust, and the ability to love without losing the self.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | LOV-01 | The love relationships closest to me feel rooted in honesty, respect, and mutual care. |
| 2 | LOV-02 | I can communicate my needs and boundaries without abandoning love or truth. |
| 3 | LOV-03 | I feel seen, valued, and emotionally safe in my closest love relationships. |
| 4 | LOV-04 | I am willing to notice my own patterns rather than only focusing on what others need to change. |
| 5 | LOV-05 | My love relationships help me remember who I am, not disappear from myself. |

---

#### Group 7: My Parenting (PAR)

**Group Description:** This dimension looks at your relationship to parenting, caregiving, legacy, guidance, repair, and emotional presence. For those without children, this can be framed as care for those you influence, mentor, guide, or help raise into life.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | PAR-01 | I show up for those in my care with presence, patience, and honest love as often as I am able. |
| 2 | PAR-02 | I am willing to repair, apologize, and grow when I do not show up the way I intended. |
| 3 | PAR-03 | My parenting or caregiving reflects the values I hope to pass forward. |
| 4 | PAR-04 | I can offer guidance without needing to control every outcome. |
| 5 | PAR-05 | I am becoming more conscious of the patterns I inherited and the patterns I am choosing to continue or end. |

---

#### Group 8: My Career (CAR)

**Group Description:** This dimension looks at vocation, contribution, purpose in work, right livelihood, energy exchange, leadership, and whether daily work reflects inner alignment.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | CAR-01 | The work I do feels connected to my gifts, values, or sense of contribution. |
| 2 | CAR-02 | My current work life supports the kind of person I am becoming. |
| 3 | CAR-03 | I have clarity about the next aligned step in my work, business, calling, or contribution. |
| 4 | CAR-04 | I am not staying in work patterns solely because of fear, obligation, or old identity. |
| 5 | CAR-05 | My work allows enough space for my health, relationships, spiritual life, and quality of life. |

---

#### Group 9: My Spiritual Life (SPI)

**Group Description:** This dimension looks at relationship with God, inner wisdom, prayer, stillness, spiritual practice, trust, surrender, and living from Truth rather than fear.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | SPI-01 | I make space to listen for God, Truth, inner wisdom, or the still small voice. |
| 2 | SPI-02 | My spiritual life is something I practice, not only something I believe. |
| 3 | SPI-03 | When life feels uncertain, I can return to trust without needing to control everything. |
| 4 | SPI-04 | I experience spiritual guidance as relevant to my practical daily decisions. |
| 5 | SPI-05 | I am learning to live from Love and Truth rather than fear, pride, pressure, or panic. |

---

#### Group 10: My Social Life (SOC)

**Group Description:** This dimension looks at friendship, belonging, community, mutual support, social energy, loneliness, and connection that honors authenticity.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | SOC-01 | I have relationships where I can be honest, known, and supported. |
| 2 | SOC-02 | My social life nourishes me rather than consistently draining or distracting me. |
| 3 | SOC-03 | I make room for meaningful connection, not just obligation, performance, or scrolling. |
| 4 | SOC-04 | I feel connected to a community, circle, or group that supports who I am becoming. |
| 5 | SOC-05 | I can honor my need for solitude without using isolation as protection from being known. |

---

#### Group 11: My Financial Life (FIN)

**Group Description:** This dimension looks at money clarity, stewardship, sufficiency, responsibility, earning, receiving, generosity, and financial alignment with values.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | FIN-01 | I have an honest understanding of my current financial reality. |
| 2 | FIN-02 | My financial choices reflect my values, responsibilities, and future vision. |
| 3 | FIN-03 | I am building a healthier relationship with earning, receiving, spending, saving, and giving. |
| 4 | FIN-04 | Money does not regularly control my peace, identity, or sense of possibility. |
| 5 | FIN-05 | I have a practical next step for creating more financial stability or freedom. |

---

#### Group 12: My Life Vision (VIS)

**Group Description:** This dimension looks at purpose, direction, desire, clarity, imagination, faithful action, and whether you are living by design rather than drift.

| # | Question ID | Question Text |
|---|-------------|---------------|
| 1 | VIS-01 | I have a clear sense of the life I am being called to create, embody, or become. |
| 2 | VIS-02 | My daily choices are connected to a larger purpose or direction. |
| 3 | VIS-03 | I can name what matters most in this season of my life. |
| 4 | VIS-04 | I am not simply reacting, drifting, or waiting for life to tell me who I am. |
| 5 | VIS-05 | I know one aligned next step I can take toward the life I say I want. |

---

## Lead Capture Configuration

### Placement
**When:** After all 60 questions, before result reveal

### Required Fields
- **First Name** (text, required)
- **Email Address** (email, required)

### Optional Fields
- **Phone Number** (tel, optional)
- **What is the one area where you most desire clarity right now?** (textarea, optional)

### Privacy Text
```
Your information will never be sold. You will receive your Alignment Snapshot and occasional LifeCharter reflections, invitations, and resources. You can unsubscribe at any time.
```

### Pre-Submission Message
```
Your Alignment Snapshot is ready.

Enter your name and email below, and we'll reveal your personalized result and send a copy to your inbox so you can revisit it when you are ready to take your next aligned step.
```

---

## Scoring & Result Categories

### Scoring Formula

**Dimension Score Calculation:**
```
Dimension Score = (Sum of 5 question values / 5) / 5 × 100
```

**Overall Alignment Score Calculation:**
```
Overall Score = Average of all 12 Dimension Scores
```

**Example:**
- Quality of Life answers: 3, 4, 2, 3, 4 = Sum: 16
- Average: 16/5 = 3.2
- Dimension Score: 3.2/5 × 100 = 64

### Result Thresholds

| Alignment Level | Score Range | Meaning |
|----------------|-------------|---------|
| **Red Light** | 0 - 39 | Area asking for immediate care, honesty, support |
| **Yellow Light** | 40 - 69 | Area functional but strained, unclear, or asking for pause |
| **Green Light** | 70 - 100 | Area moving with clarity, congruence, support |

**Overall Score Ranges:**
- Red Light Season: 0-39
- Yellow Light Season: 40-69
- Green Light Season: 70-100

### QuizForma Result Categories

Create **3 Primary Result Categories** based on overall score:

#### Category 1: Red Light Alignment Season
- **Score Range:** 0-39 (or 60-124 total points)
- **Redirect URL:** Page Sprout Red Light Result Page
- **Primary CTA:** LifeCharter Summit
- **Secondary CTA:** LifeCharter Incubator

#### Category 2: Yellow Light Alignment Season
- **Score Range:** 40-69 (or 125-186 total points)
- **Redirect URL:** Page Sprout Yellow Light Result Page
- **Primary CTA:** LifeCharter Incubator
- **Secondary CTA:** LifeCharter Circle

#### Category 3: Green Light Alignment Season
- **Score Range:** 70-100 (or 187-240 total points)
- **Redirect URL:** Page Sprout Green Light Result Page
- **Primary CTA:** LifeCharter Circle
- **Secondary CTA:** Book a LifeCharter Conversation

---

## Lead Segmentation Strategy

### Required Tags/Categories

**Completion Tags:**
- Alignment Snapshot Completed

**Alignment Level Tags:**
- Alignment Level: Red Light
- Alignment Level: Yellow Light
- Alignment Level: Green Light

**Offer Tags:**
- Summit Invite
- Incubator Invite
- LifeCharter Circle Candidate

### Optional Tags (If QuizForma Supports)

**Primary Pattern Tags:**
- Pattern: Overextended Giver
- Pattern: Sacred Drifter
- Pattern: Quiet Achiever
- Pattern: Survival Strategist
- Pattern: Disconnected Visionary
- Pattern: Relationship-Tethered Traveler
- Pattern: Purpose-Ready Butterfly

**Dimension Focus Tags:**
- Low Dimension: [Dimension Name]
- High Dimension: [Dimension Name]

### Data Fields to Capture

**User Identity:**
- first_name
- email
- phone (optional)
- completion_date

**Assessment Data:**
- overall_alignment_score
- overall_alignment_level
- dimension_scores (all 12)
- top_misaligned_dimensions
- top_aligned_dimensions

**Routing Data:**
- recommended_offer
- result_category

---

## Email Follow-Up Sequence

### Email 1: Your Alignment Snapshot Is Ready
**Timing:** Immediately after completion
**Subject:** Your LifeCharter Alignment Snapshot is ready
**Preview:** Your results and next step inside

**Content:**
- Personalized greeting
- Overall alignment level
- Brief interpretation
- Link to full results (Page Sprout result page)
- CTA to next LifeCharter step

---

### Email 2: Why Misalignment Feels Like Overwhelm
**Timing:** 1 day later
**Subject:** Why misalignment feels like overwhelm

**Content:**
- Teach: Overwhelm is often a signal, not a character flaw
- Connection between drift and overwhelm
- Introduce LifeCharter as structure for alignment
- CTA: Return to your Snapshot or join next LifeCharter step

---

### Email 3: The Yellow Light Is Not Failure
**Timing:** 2 days later
**Subject:** The Yellow Light is not failure

**Content:**
- Teach: Yellow Yield principle
- Yellow Light as transformation beginning
- Invitation to pause and choose differently
- CTA: Join Incubator or Summit

---

### Email 4: The 12 Dimensions of a Life That Fits
**Timing:** 3 days later
**Subject:** The 12 Dimensions of a Life That Fits

**Content:**
- Introduce full LifeCharter framework
- Brief overview of all 12 dimensions
- CTA: Explore LifeCharter Circle or attend next event

---

### Email 5: Your Invitation to Go Deeper
**Timing:** 4-5 days later
**Subject:** Your invitation to go deeper

**Content:**
- Insight becomes real through practice
- Clear invitation based on their result
- Why now matters
- Strong CTA to recommended offer

---

## AI Report Integration Options

### Option A: Static Result Pages (Fastest MVP)
- Use Page Sprout result pages with pre-written copy
- No AI integration required
- Segment by Red/Yellow/Green only

### Option B: Semi-Personalized Results
- Use QuizForma scoring categories
- Show overall result + lowest dimension
- Static copy with dynamic insertion of dimension names

### Option C: Full AI Report (If AIBot Studio Available)
- Send QuizForma responses to AIBot Studio
- Use AI Report Prompt + JSON Schema
- Generate personalized report
- Display on Page Sprout results page or send via email

**Recommended for MVP:** Option A or B
**Future Enhancement:** Option C

---

## Testing Checklist

### Pre-Launch Testing

**Page Sprout Pages:**
- [ ] Landing page loads correctly
- [ ] All CTAs link to correct pages
- [ ] Mobile responsive
- [ ] Branding applied correctly
- [ ] Privacy text included

**QuizForma Assessment:**
- [ ] All 12 dimension groups created
- [ ] All 60 questions entered correctly
- [ ] Answer scale set to 1-5
- [ ] Point values assigned correctly
- [ ] Lead capture form configured
- [ ] Privacy text included

**Scoring & Results:**
- [ ] Test low-score user (Red Light)
- [ ] Test mid-score user (Yellow Light)
- [ ] Test high-score user (Green Light)
- [ ] Verify redirect URLs work
- [ ] Confirm result pages display correctly

**Lead Capture:**
- [ ] Name field required
- [ ] Email field required
- [ ] Form validation works
- [ ] Test submission creates lead
- [ ] Tags applied correctly

**Integration:**
- [ ] Global Control receives leads (if available)
- [ ] Letterman sends emails (if available)
- [ ] CTA buttons link to correct offers

### Sample Test Scenarios

**Test User 1: Red Light**
- Answer mostly 1s and 2s
- Expected: Red Light result
- CTA: Summit or Incubator

**Test User 2: Yellow Light**
- Answer mostly 2s and 3s
- Expected: Yellow Light result
- CTA: Incubator or Circle

**Test User 3: Green Light**
- Answer mostly 4s and 5s
- Expected: Green Light result
- CTA: Circle or Conversation

---

## Brand Guidelines

### Colors
Use Sacred Kaleidoscope brand palette:
- **Paper:** #F5F1E8 (backgrounds)
- **Fog:** #DAD2B9 (secondary fills)
- **Sage:** #ADB8A0 (cool accent)
- **Ochre:** #C4B792 (warm structure)
- **Clay:** #CBA488 (human warmth)
- **Ink:** #2F312F (primary text)
- **Linework Taupe:** #8F8875 (guides, borders)

### Typography
- **Headlines:** EB Garamond
- **Body:** Open Sans

### Voice & Tone
- Compassionate
- Metaphysical
- Practical
- Warm
- Direct but gentle
- Spiritually grounded
- Non-shaming

### Visual Elements
- Butterfly motif
- Soft sacred kaleidoscope textures
- Red, Yellow, Green alignment indicators
- Gentle progress indicators
- Clean, spacious layout

---

## Success Metrics

### Lead Metrics
- Landing page conversion rate (target: 30%+)
- Assessment start rate
- Assessment completion rate (target: 60%+)
- Email capture rate (target: 70%+)

### Engagement Metrics
- Results page view rate
- Email open rate (target: 35%+)
- Email click-through rate
- CTA click rate (target: 5-15%)

### Conversion Metrics
- Summit registration rate from Snapshot
- Incubator registration rate from Snapshot
- Discovery call booking rate
- LifeCharter Circle conversion rate

---

## Launch Plan

### Phase 1: Build & Test (Week 1)
- Create all Page Sprout pages
- Build QuizForma assessment
- Configure scoring and results
- Test all user flows

### Phase 2: Soft Launch (Week 2)
- Share with small test group
- Gather feedback
- Refine copy and flow
- Fix any issues

### Phase 3: Full Launch (Week 3)
- Email list announcement
- Social media campaign
- Organic posts across platforms
- Monitor metrics and optimize

---

## Post-Launch Optimization

### Monthly Review
- Completion rates by dimension
- Most common result category
- Conversion rates by result
- Email engagement metrics

### Future Enhancements
- Add AI-generated reports (AIBot Studio)
- Create pattern-specific result pages
- Add dimension-specific follow-up sequences
- Build retake functionality (30/60/90 days)
- Create shareable social result cards

---

## Important Guardrails

### Do NOT:
- ❌ Use GoHighLevel
- ❌ Diagnose users
- ❌ Promise specific outcomes
- ❌ Use fear-based language
- ❌ Shame users for low scores
- ❌ Give medical, legal, or financial advice
- ❌ Reveal full report before email capture
- ❌ Overcomplicate the MVP

### DO:
- ✅ Keep language compassionate and invitational
- ✅ Frame low scores as invitations, not failures
- ✅ Honor the sacred pause nature of the experience
- ✅ Guide users to appropriate next steps
- ✅ Protect user privacy
- ✅ Test thoroughly before launch

---

## Support & Resources

### Build Assets Location
`/root/.openclaw/workspace/projects/lifecharter-alignment-snapshot/`

### Source Documents
- PRD: `life_charter_alignment_snapshot_prd.md`
- Question Bank: `LifeCharter_Alignment_Snapshot_12_Dimension_Question_Bank.md`
- AI Prompt: `LifeCharter_Alignment_Snapshot_AI_Report_Prompt_JSON_Schema.md`

### Chad Nicely Suite Access
- Page Sprout: [Login URL]
- QuizForma: [Login URL]
- Global Control: [Login URL] (if available)
- Letterman: [Login URL] (if available)

---

*Built for AmiLynne "Babs" Carroll and Sacred Kaleidoscope Community*  
*May 2026*  
*Head up, wings out.* 🦋