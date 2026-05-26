---
name: stripe-setup
description: Securely set up Stripe API integration with guardrails. Handles API key validation, secure storage, encryption, testing, and error handling. Use when user wants to configure Stripe payments, store API keys securely, or automate Stripe product creation.
---

# Stripe Setup with Guardrails

Securely configure Stripe API integration for OpenClaw with comprehensive security guardrails.

## Command

`/stripe_api_setup_with_guardrails`

## Workflow

### Step 1: Request & Validate Stripe API Keys

**Secret Key Validation:**
- Must start with `sk_live_` or `sk_test_`
- Format: `sk_(live|test)_[32+ alphanumeric characters]`
- Reject if: Wrong prefix, too short, contains spaces

**Publishable Key Validation:**
- Must start with `pk_live_` or `pk_test_`
- Format: `pk_(live|test)_[32+ alphanumeric characters]`
- Reject if: Wrong prefix, too short, contains spaces

**Guardrail:** Display validation errors immediately. Do not proceed with invalid keys.

### Step 2: Consent & Transparency

**Required Checkbox:**
```
☐ I understand I am providing sensitive financial API keys.
☐ I consent to secure storage using AES-256 encryption.
☐ I understand these keys allow payment processing on my behalf.
```

**Guardrail:** Do not proceed without explicit consent.

### Step 3: Secure Key Storage

**Security Implementation:**
- Store in: `~/.openclaw/credentials/stripe.encrypted`
- Encryption: AES-256-GCM with unique salt per installation
- Key file permissions: `600` (owner read/write only)
- Never store in: Codebase, git repos, unencrypted files

**Storage Format:**
```json
{
  "encrypted_secret_key": "base64_encrypted_string",
  "encrypted_publishable_key": "base64_encrypted_string",
  "key_version": "1",
  "stored_at": "ISO8601_timestamp",
  "mode": "test|live"
}
```

### Step 4: Key Validation (Testing)

**Test Mode First:**
1. Detect key mode from prefix (`sk_test_` vs `sk_live_`)
2. If live keys: Warn user and require explicit confirmation
3. Call Stripe `/v1/charges` with test card: `4242 4242 4242 4242`
4. Expect: Successful test charge creation
5. Delete test charge immediately after validation

**Validation Failure Handling:**
- Log error to encrypted log
- Notify user with specific error
- Do not store invalid keys
- Suggest: Check key format, verify Stripe account status

### Step 5: Product Creation Setup (Optional)

**Enable Product Creation:**
- Store setting: `stripe_product_creation_enabled: true`
- Implement role-based access: `stripe_admin` role required
- Guardrail: Validate all product creation requests
- Log all product creation attempts

### Step 6: Error Handling & Logging

**Error Categories:**
- `INVALID_KEY_FORMAT`: Key doesn't match expected pattern
- `STRIPE_AUTH_FAILED`: Stripe rejected credentials
- `ENCRYPTION_FAILED`: Could not encrypt keys
- `RATE_LIMITED`: Hit Stripe rate limit (429)
- `NETWORK_ERROR`: Connection issues

**Logging:**
- Location: `~/.openclaw/logs/stripe.log` (encrypted)
- Never log: Full API keys, card numbers, PII
- Log: Timestamps, error types, action attempted

**Rate Limit Handling:**
- Stripe default: 100 req/s for live, 25 req/s for test
- On 429: Exponential backoff (1s, 2s, 4s, 8s)
- Max retries: 3

### Step 7: Completion & Summary

**Display to User:**
- ✅ Keys validated and stored securely
- ✅ Encryption: AES-256-GCM
- ✅ Mode detected: Test/Live
- ✅ Validation: Successful
- 📍 Storage: `~/.openclaw/credentials/stripe.encrypted`

**Next Steps:**
- Test mode: Ready for development
- Live mode: Ready for production (use with caution)
- Product creation: Enabled/Disabled

## Security Checklist

- [ ] Keys validated for correct format
- [ ] User provided explicit consent
- [ ] Keys encrypted with AES-256
- [ ] File permissions set to 600
- [ ] Test validation passed
- [ ] Error logging configured
- [ ] Rate limiting implemented

## Error Messages

**Invalid Secret Key:**
"Secret key must start with 'sk_live_' or 'sk_test_' and be at least 40 characters. Please check your Stripe Dashboard > Developers > API Keys."

**Invalid Publishable Key:**
"Publishable key must start with 'pk_live_' or 'pk_test_' and be at least 40 characters. Please check your Stripe Dashboard > Developers > API Keys."

**Live Mode Warning:**
"⚠️ LIVE MODE DETECTED: These are production keys that will process real payments. Ensure you're ready for production use. Type 'CONFIRM_LIVE' to proceed."

**Validation Failed:**
"Stripe rejected the API keys. Error: [error_message]. Please verify: 1) Keys are copied correctly, 2) Your Stripe account is active, 3) Keys have not been revoked."

## Script Usage

```bash
# Run full setup
python3 scripts/stripe_setup.py setup

# Validate existing keys
python3 scripts/stripe_setup.py validate

# Test connection
python3 scripts/stripe_setup.py test

# Enable product creation
python3 scripts/stripe_setup.py enable-products
```

## Reference

- Stripe API Docs: https://stripe.com/docs/api
- Security Best Practices: See `references/stripe-security.md`
- Rate Limits: See `references/stripe-limits.md`
