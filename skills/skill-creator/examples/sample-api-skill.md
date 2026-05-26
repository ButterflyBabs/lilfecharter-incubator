---
name: weather-alerts
description: Real-time weather monitoring with alerts and forecasts using OpenWeatherMap API. Activate when user asks about weather, forecasts, temperature, or weather alerts.
version: 1.0.0
license: MIT
metadata: {"openclaw":{"requires":{"env":["OPENWEATHER_API_KEY"],"bins":["curl","jq"]},"primaryEnv":"OPENWEATHER_API_KEY","emoji":"🌤️"}}
---

# 🌤️ Weather Alerts

Real-time weather monitoring, forecasts, and severe weather alerts powered by OpenWeatherMap API.

## When to Activate

Activate this skill when the user mentions anything related to:
- Current weather, temperature, conditions
- Weather forecasts, weekly outlook
- Severe weather alerts, storm tracking
- Travel weather, outdoor planning

**Activation Keywords:** weather, temperature, forecast, rain, storm, wind, humidity, sunny, cloudy, snow, alert, climate, outdoor, umbrella

**Example Triggers:**
- "What's the weather like in New York?"
- "Will it rain tomorrow?"
- "Set up weather alerts for my city"
- "Give me a 5-day forecast for London"
- "Is it safe to go hiking this weekend?"

## First Interaction

"Hey! 🌤️ I'm your Weather Alerts assistant. I can check current conditions, give you forecasts, and set up severe weather alerts.

Quick commands:
- `/weather [city]` — Current conditions
- `/forecast [city] [days]` — Multi-day forecast
- `/weather-alert [city]` — Set up severe weather alerts
- `/weather-compare [city1] [city2]` — Compare two locations

First, I'll need your OpenWeatherMap API key. You can get a free one at https://openweathermap.org/api — it takes 30 seconds!"

## Setup Guide

### Step 1: Get Your API Key
1. Go to https://openweathermap.org/api
2. Click "Sign Up" (free tier gives 1,000 calls/day)
3. After signup, go to "API Keys" tab
4. Copy your API key

### Step 2: Configure
Set your environment variable:
```bash
export OPENWEATHER_API_KEY="your_key_here"
```

### Step 3: Verify
```bash
curl -s "https://api.openweathermap.org/data/2.5/weather?q=London&appid=$OPENWEATHER_API_KEY" | jq '.name'
```
✅ If you see "London", you're all set!

## Slash Commands & Workflows

### `/weather [city]` — Current Conditions

**Workflow:**
1. ⏳ Checking weather for [city]...
2. Call API:
   ```bash
   curl -s "https://api.openweathermap.org/data/2.5/weather?q=[city]&appid=$OPENWEATHER_API_KEY&units=metric" | jq '.'
   ```
3. Parse response for temperature, conditions, humidity, wind
4. ✅ Display formatted weather card:

```
🌤️ Weather in New York
━━━━━━━━━━━━━━━━━━━━
🌡️ Temperature: 22°C (feels like 24°C)
☁️ Conditions: Partly Cloudy
💧 Humidity: 65%
💨 Wind: 12 km/h NW
👁️ Visibility: 10 km
🌅 Sunrise: 6:42 AM | 🌇 Sunset: 7:18 PM
━━━━━━━━━━━━━━━━━━━━
💡 Great day for outdoor activities!
```

### `/forecast [city] [days]` — Multi-Day Forecast

**Workflow:**
1. ⏳ Loading [days]-day forecast for [city]...
2. Call 5-day forecast API:
   ```bash
   curl -s "https://api.openweathermap.org/data/2.5/forecast?q=[city]&appid=$OPENWEATHER_API_KEY&units=metric" | jq '.'
   ```
3. Group by day, calculate highs/lows
4. ✅ Display daily forecast table

### `/weather-alert [city]` — Severe Weather Alerts

**Workflow:**
1. ⏳ Setting up weather monitoring for [city]...
2. Get city coordinates from geocoding API
3. Configure cron job to check every 3 hours: `0 0 */3 * * *`
4. Alert triggers: extreme temperatures, storms, heavy rain, snow, high winds
5. ✅ "Weather alerts active for [city]! I'll notify you of any severe conditions."

### `/weather-compare [city1] [city2]` — Compare Locations

**Workflow:**
1. ⏳ Comparing weather between [city1] and [city2]...
2. Fetch both cities in parallel
3. ✅ Display side-by-side comparison table

## API Reference

| Endpoint | Purpose | Rate Limit |
|----------|---------|------------|
| `/data/2.5/weather` | Current weather | 60 calls/min |
| `/data/2.5/forecast` | 5-day forecast | 60 calls/min |
| `/geo/1.0/direct` | City geocoding | 60 calls/min |
| `/data/3.0/onecall` | One Call (premium) | Varies by plan |

**Authentication:** Query parameter `appid=$OPENWEATHER_API_KEY`
**Base URL:** `https://api.openweathermap.org`
**Free Tier:** 1,000 calls/day, current weather + 5-day forecast

## Automation & Cron Jobs

| Schedule | Task | Description |
|----------|------|-------------|
| `0 0 7 * * *` | Morning weather | "Good morning! Here's today's weather for [default_city]" |
| `0 0 */3 * * *` | Alert check | Check for severe weather conditions |
| `0 0 20 * * 0` | Weekly outlook | "Here's your weather outlook for the week ahead" |

## Guardrails & Safety

1. **NEVER** exceed API rate limits (60 calls/min on free tier)
2. **ALWAYS** cache responses for 10 minutes to reduce API calls
3. **NEVER** store the API key in plain text files — use environment variables only
4. **ALWAYS** handle city-not-found errors gracefully
5. **ALWAYS** show units (°C/°F) clearly and let user set preference

## Failure Handling

| Error | User Message | Recovery |
|-------|-------------|----------|
| 401 Unauthorized | "Your API key doesn't seem to work. Let's verify it — go to openweathermap.org/api and check your key." | Guide re-setup |
| 404 City Not Found | "I couldn't find '[city]'. Try the full city name, or add the country code like 'Paris,FR'." | Suggest alternatives |
| 429 Rate Limited | "We've hit the API limit. I'll try again in a minute." | Wait 60s and retry |
| Network Error | "Can't reach the weather service right now. I'll try again shortly." | Retry with backoff |

## Pro Tips

💡 **Default City:** Set your home city once and just say "what's the weather?" without specifying
💡 **Travel Planning:** Ask "Compare weather in Bali and Thailand next week" for trip decisions
💡 **Smart Alerts:** Alerts auto-adjust severity based on your location's typical weather patterns
