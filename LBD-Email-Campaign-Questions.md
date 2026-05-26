# Life by Design Summit - Email Campaign Questions & Decisions

**Document Purpose:** Track all open questions, decisions, and action items for building the email workflows in Global Control.

**Status:** Ready for review and decision-making
**Created:** May 5, 2026

---

## SECTION 1: TECHNICAL SETUP QUESTIONS

### 1.1 Email Platform Connection
- [ ] **QUESTION:** Should we connect Mailgun in Global Control tonight or first thing tomorrow?
  - **Context:** API key is available: `36af6158e92edf4908efad41fcfa9c24-428c42a0-c2ce3a41`
  - **Impact:** Cannot send emails until this is connected
  - **Decision Needed:** Yes/No + timing

### 1.2 From Email Address
- [ ] **QUESTION:** What email address should emails be sent from?
  - **Options:**
    - amilynne@amilynnecarroll.com
    - babs@sacredkaleidoscope.com
    - info@lifecharter.com
    - Other: ___________
  - **Impact:** Affects deliverability and brand recognition
  - **Decision Needed:** Select one

### 1.3 Reply-To Address
- [ ] **QUESTION:** Where should replies to summit emails go?
  - **Options:**
    - Same as From address
    - Different support email
    - No reply (do not reply address)
  - **Decision Needed:** Select option

---

## SECTION 2: EMAIL CONTENT QUESTIONS

### 2.1 Email Copywriting
- [ ] **QUESTION:** Who will write the actual email copy?
  - **Options:**
    - Babs writes all emails (maintains voice)
    - Mariposa drafts, Babs edits
    - Hybrid approach
  - **Impact:** Timeline and voice consistency
  - **Decision Needed:** Select approach

### 2.2 Email Template Design
- [ ] **QUESTION:** What should the email template look like?
  - **Options:**
    - Plain text (simple, personal)
    - Branded HTML (LifeCharter colors, logo)
    - Minimal HTML (basic formatting)
  - **Impact:** Brand consistency vs. deliverability
  - **Decision Needed:** Select style

### 2.3 Email Signature
- [ ] **QUESTION:** What should the email signature include?
  - **Options to consider:**
    - Babs' name and title
    - LifeCharter logo
    - Social media links
    - Website link
    - Photo/headshot
    - Disclaimer/unsubscribe
  - **Decision Needed:** List required elements

---

## SECTION 3: WORKFLOW LOGIC QUESTIONS

### 3.1 Registration Confirmation Timing
- [ ] **QUESTION:** Should confirmation emails send immediately or batched?
  - **Options:**
    - Immediate (real-time)
    - Batched (every 15 minutes)
    - Daily digest
  - **Recommendation:** Immediate for best experience
  - **Decision Needed:** Confirm approach

### 3.2 Bump-Up Email Frequency
- [ ] **QUESTION:** Are we comfortable with the Integration Pass bump sequence frequency?
  - **Current Schedule:**
    - 24 hours after registration
    - 3 days after registration
    - 7 days after registration
    - 10-14 days before summit
  - **Concern:** Is this too many emails? Too few?
  - **Decision Needed:** Confirm or adjust timing

### 3.3 Abandoned Cart Timing
- [ ] **QUESTION:** When should abandoned Integration Pass emails trigger?
  - **Current:** 2 hours after click, then 24 hours
  - **Options:**
    - Keep as is
    - Faster (30 min, 4 hours)
    - Slower (6 hours, 48 hours)
  - **Decision Needed:** Confirm timing

### 3.4 Weekly Nurture Day
- [ ] **QUESTION:** What day of the week should weekly nurture emails send?
  - **Options:** Tuesday, Wednesday, Thursday
  - **Consideration:** Avoid Monday (busy) and Friday (checked out)
  - **Decision Needed:** Select day

### 3.5 Daily Summit Email Timing
- [ ] **QUESTION:** Confirm daily email timing during summit
  - **Current Plan:**
    - Morning access: 7:00 AM MT
    - Afternoon reflection: 2:30 PM MT
  - **Question:** Is 7 AM too early? Should it be 8 AM?
  - **Decision Needed:** Confirm times

---

## SECTION 4: SEGMENTATION & PERSONALIZATION

### 4.1 Dynamic Content
- [ ] **QUESTION:** How much personalization should emails include?
  - **Options:**
    - Basic (First name only)
    - Moderate (Name + pass type)
    - Advanced (Name + pass type + timezone + custom fields)
  - **Impact:** Complexity vs. relevance
  - **Decision Needed:** Select level

### 4.2 Time Zone Handling
- [ ] **QUESTION:** Should we adjust email send times based on timezone?
  - **Options:**
    - No, send at same time for everyone (simpler)
    - Yes, adjust to local time (better experience)
  - **Technical Note:** Global Control may not support timezone-based sending
  - **Decision Needed:** Select approach

### 4.3 No-Show Follow-Up
- [ ] **QUESTION:** How should we handle registered attendees who don't show up?
  - **Current Plan:** Tag as LBD-No-Show after summit
  - **Follow-Up:** Special "We missed you" sequence?
  - **Decision Needed:** Yes/No + timing

---

## SECTION 5: POST-SUMMIT CONVERSION

### 5.1 LifeCharter Circle Invitation
- [ ] **QUESTION:** What is the LifeCharter Circle offer for post-summit?
  - **Details Needed:**
    - Price point
    - What's included
    - Duration (monthly, annual)
    - Bonus for Integration Pass holders ($495 credit)
  - **Impact:** Email copy and CTA
  - **Decision Needed:** Full offer details

### 5.2 Credit Expiration Reminder
- [ ] **QUESTION:** How aggressive should the $495 credit expiration reminder be?
  - **Current:** Day 7 "Final reminder"
  - **Options:**
    - Single reminder (current)
    - Multiple reminders (Day 5, 6, 7)
    - Urgency level (gentle vs. firm)
  - **Decision Needed:** Confirm approach

### 5.3 Replay Access Duration
- [ ] **QUESTION:** How long should replays be available?
  - **Next Chapter Pass:** Limited time (how long?)
  - **Integration Pass:** Extended access (how long?)
  - **Decision Needed:** Specific timeframes

---

## SECTION 6: TESTING & QUALITY ASSURANCE

### 6.1 Test Email Addresses
- [ ] **QUESTION:** What emails should we use for testing?
  - **Needed:**
    - Babs' email
    - Mariposa's email
    - Test email accounts (Gmail, Yahoo, Outlook)
  - **Decision Needed:** List test emails

### 6.2 Testing Checklist
- [ ] **QUESTION:** What should we test before going live?
  - **Suggested Items:**
    - All 8 workflows trigger correctly
    - Tags apply properly
    - Emails render in all clients
    - Links work
    - Unsubscribe works
    - Mobile display
  - **Decision Needed:** Confirm testing scope

### 6.3 Soft Launch
- [ ] **QUESTION:** Should we do a soft launch with a small group first?
  - **Options:**
    - Yes, test with 5-10 people
    - No, launch to everyone
  - **Decision Needed:** Yes/No

---

## SECTION 7: COMPLIANCE & LEGAL

### 7.1 Unsubscribe Footer
- [ ] **QUESTION:** What should the unsubscribe footer say?
  - **Required Elements:**
    - Unsubscribe link
    - Physical address (CAN-SPAM requirement)
    - Company name
  - **Decision Needed:** Draft footer text

### 7.2 Privacy Policy
- [ ] **QUESTION:** Is the privacy policy up to date for email collection?
  - **Consideration:** GDPR, CAN-SPAM compliance
  - **Decision Needed:** Review/update required?

### 7.3 Email Consent
- [ ] **QUESTION:** Do we need explicit consent checkboxes on the registration form?
  - **Current:** Registration implies consent
  - **Question:** Should we add explicit opt-in checkbox?
  - **Decision Needed:** Yes/No

---

## SECTION 8: MONITORING & OPTIMIZATION

### 8.1 Key Metrics to Track
- [ ] **QUESTION:** What email metrics should we monitor?
  - **Suggested:**
    - Open rates
    - Click-through rates
    - Conversion rates (free → paid)
    - Unsubscribe rates
    - Bounce rates
  - **Decision Needed:** Confirm metrics

### 8.2 A/B Testing
- [ ] **QUESTION:** Should we A/B test subject lines or content?
  - **Options:**
    - Yes, from the start
    - No, launch then optimize
    - Test only high-impact emails
  - **Decision Needed:** Select approach

### 8.3 Reporting Frequency
- [ ] **QUESTION:** How often should we review email performance?
  - **Options:**
    - Daily during summit
    - Weekly
    - After summit ends
  - **Decision Needed:** Select frequency

---

## SECTION 9: INTEGRATION QUESTIONS

### 9.1 Stripe Webhook Integration
- [ ] **QUESTION:** Should we set up Stripe webhooks for real-time payment notifications?
  - **Current:** Redirect to Stripe payment link
  - **Advanced:** Webhook to auto-tag upon payment
  - **Decision Needed:** Keep simple or add webhook?

### 9.2 Zoom Integration
- [ ] **QUESTION:** How will summit access links be delivered?
  - **Options:**
    - Include in daily emails
    - Separate access page
    - Both
  - **Decision Needed:** Select approach

### 9.3 Workbook Delivery
- [ ] **QUESTION:** How should Integration Pass workbooks be delivered?
  - **Options:**
    - Email download link
    - Member portal access
    - Both
  - **Decision Needed:** Select method

---

## SECTION 10: CONTENT CREATION NEEDS

### 10.1 Email Copy Status
| Email | Status | Assigned To |
|-------|--------|-------------|
| 1A: Free Confirmation | ⬜ Needs Writing | |
| 1B: Next Chapter Confirmation | ⬜ Needs Writing | |
| 1C: Integration Confirmation | ⬜ Needs Writing | |
| 2: Free-to-Next-Chapter | ⬜ Needs Writing | |
| 3-6: Integration Bump | ⬜ Needs Writing | |
| Weekly Nurture (5) | ⬜ Needs Writing | |
| Countdown (4) | ⬜ Needs Writing | |
| During Summit (6) | ⬜ Needs Writing | |
| Abandoned (2) | ⬜ Needs Writing | |
| Post-Summit (5) | ⬜ Needs Writing | |

### 10.2 Creative Assets Needed
- [ ] Email header image/branding
- [ ] Babs' email signature photo
- [ ] Social media icons for footer
- [ ] Calendar invite graphics

---

## PRIORITY DECISIONS (Address First)

### Must Decide Before Building:
1. ⬜ Mailgun connection timing
2. ⬜ From email address
3. ⬜ Who writes email copy
4. ⬜ Email template style
5. ⬜ LifeCharter Circle offer details

### Can Decide During Build:
6. ⬜ Exact send times
7. ⬜ A/B testing approach
8. ⬜ Soft launch decision

---

## NOTES & IDEAS

*Add any additional thoughts, ideas, or questions here as they come up*

---

**Last Updated:** May 5, 2026
**Next Review:** May 6, 2026
