# LifeCharter Alignment Snapshot - Deployment Checklist

**Last Updated:** May 3, 2026  
**Status:** ✅ PRODUCTION READY

---

## Pre-Flight Checklist

### Environment Variables (Vercel)
All must be configured in Production environment:

- [ ] **OPENAI_API_KEY** - Valid OpenAI API key with GPT-4o access
- [ ] **RESEND_API_KEY** - Valid Resend API key
- [ ] **FROM_EMAIL** - `amilynne@amilynnecarroll.com` (must be verified in Resend)
- [ ] **GLOBAL_CONTROL_API_KEY** - Valid Global Control CRM API key

### API Endpoints
All endpoints should return 200 on POST requests:

- [ ] `https://lifecharter-alignment-snapshot.vercel.app/api/generate-report`
- [ ] `https://lifecharter-alignment-snapshot.vercel.app/api/send-email`
- [ ] `https://lifecharter-alignment-snapshot.vercel.app/api/crm-sync`

### Frontend Pages
All pages should load without errors:

- [ ] Landing page: `https://lifecharter-alignment-snapshot.vercel.app/`
- [ ] Assessment flow (click "Begin Your Snapshot")
- [ ] All 12 dimensions display correctly
- [ ] Email capture form validates
- [ ] Loading screen displays
- [ ] Results page renders

---

## Quick Test Commands

### Test AI Report Generation
```bash
curl -X POST https://lifecharter-alignment-snapshot.vercel.app/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "user_profile": {"first_name": "Test", "email": "test@example.com"},
    "score_summary": {"overall_alignment_score": 55, "overall_alignment_level": "Yellow Light"},
    "dimension_scores": [{"dimension_id": "test", "dimension_name": "Test", "score": 50, "alignment_level": "Yellow Light", "rank_from_lowest": 1}],
    "offer_routing": {"overall_level": "Yellow Light", "pattern": "Test", "recommended_offer": "LifeCharter Incubator"}
  }'
```

### Test Email Delivery
```bash
curl -X POST https://lifecharter-alignment-snapshot.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to_email": "test@example.com",
    "first_name": "Test",
    "ai_report": {"user": {"first_name": "Test"}, "score_summary": {"overall_alignment_score": 55}}
  }'
```

### Test CRM Sync
```bash
curl -X POST https://lifecharter-alignment-snapshot.vercel.app/api/crm-sync \
  -H "Content-Type: application/json" \
  -d '{
    "user_profile": {"first_name": "Test", "email": "test@example.com"},
    "score_summary": {"overall_alignment_score": 55, "overall_alignment_level": "Yellow Light"},
    "dimension_scores": [],
    "primary_alignment_pattern": {"pattern_name": "Test", "confidence": "High", "pattern_summary": "Test", "supportive_truth": "Test", "risk_if_ignored": "Test", "pattern_next_step": "Test"},
    "recommended_pathway": {"offer_name": "LifeCharter Incubator", "offer_reason": "Test", "cta_label": "Test", "cta_url": "https://example.com", "sales_tone": "Invitation"}
  }'
```

---

## Full End-to-End Test

1. Visit: https://lifecharter-alignment-snapshot.vercel.app/
2. Click "Begin Your Snapshot"
3. Read welcome message
4. Complete all 36 questions (3 per dimension)
5. Enter test email and name
6. Submit
7. Wait for processing (~15-20 seconds)
8. Verify:
   - Results page displays with correct score
   - Pattern is detected
   - Recommended offer shows
   - Email received by participant
   - Copy received by Babs
   - Contact appears in Global Control CRM

---

## Common Issues & Fixes

### Issue: CRM sync returns 401
**Fix:** Update GLOBAL_CONTROL_API_KEY in Vercel environment variables

### Issue: Emails not sending
**Fix:** 
1. Verify RESEND_API_KEY
2. Check FROM_EMAIL is verified in Resend dashboard
3. Check spam folders

### Issue: AI report times out
**Fix:** 
1. Check OPENAI_API_KEY is valid
2. Verify GPT-4o model access
3. Check OpenAI rate limits

### Issue: Frontend not loading
**Fix:**
1. Check Vercel deployment status
2. Verify all files uploaded correctly
3. Check browser console for JavaScript errors

---

## Deployment Steps

1. **Make code changes** in `/root/.openclaw/workspace/lifecharter-alignment-snapshot/`
2. **Test locally** if possible
3. **Deploy to Vercel:**
   ```bash
   cd /root/.openclaw/workspace/lifecharter-alignment-snapshot
   vercel --prod
   ```
4. **Wait for deployment** to complete
5. **Run quick tests** (see commands above)
6. **Run full end-to-end test**
7. **Verify emails** are received
8. **Check CRM** for contact

---

## Success Criteria

✅ All 3 API endpoints return 200  
✅ Frontend loads without errors  
✅ Assessment can be completed  
✅ AI report generates successfully  
✅ Emails sent to both participant and Babs  
✅ Contact syncs to Global Control CRM  
✅ Results page displays correctly  

---

## Support Contacts

- **Mariposa (AI Chief of Staff):** Available via Telegram
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Resend Dashboard:** https://resend.com
- **Global Control CRM:** https://app.globalcontrol.io

---

*This system is production-ready and fully operational as of May 3, 2026.*