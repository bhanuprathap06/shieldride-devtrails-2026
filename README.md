
# 🛡️ ShieldRide — AI-Powered Parametric Income Insurance for Gig Delivery Workers

> **Guidewire DEVTrails 2026 | Team Submission | Phase 1**

---

## 📌 Problem Statement

India's food delivery partners (Zomato, Swiggy) are the backbone of the urban economy. Yet they are completely exposed to income loss caused by external, uncontrollable disruptions — heavy rain, floods, extreme heat, severe pollution, and civic unrest.

When disruptions strike, delivery volumes drop to near zero. Workers lose 20–30% of their monthly earnings with **no safety net, no compensation, and no recourse**.

**ShieldRide solves this.** We are building an AI-enabled parametric income insurance platform that automatically detects disruptions, triggers claims without any manual intervention, and delivers instant payouts — so workers never have to choose between riding in a storm or going hungry.

---

## 👤 Chosen Persona

**Food Delivery Partners** — Zomato & Swiggy riders in metro cities (Mumbai, Delhi, Bangalore, Hyderabad, Chennai)

### Why This Persona?
- Largest gig worker segment in India (5M+ workers)
- Most directly impacted by weather disruptions (rain = zero orders)
- Weekly earnings cycle makes micro-insurance both practical and essential
- High digital literacy (smartphone-first workers) enables seamless onboarding

### Persona Scenario — Meet Raju

> Raju is a 26-year-old Swiggy delivery partner in Bangalore. He earns ₹800–₹1,200/day, working 10–12 hours. During the 2023 monsoon, he lost 14 working days due to heavy rain — nearly ₹15,000 in lost income with no recourse. He had no savings to fall back on.

**With ShieldRide:**
- Raju pays ₹69/week for income protection
- When rainfall exceeds 25mm/hr in his zone, ShieldRide auto-detects the disruption
- A claim is triggered automatically — no form, no call, no proof needed
- ₹400–₹600 is credited to his UPI account within minutes

---

## 🔁 Application Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                        SHIELDRIDE WORKFLOW                       │
└──────────────────────────────────────────────────────────────────┘

1. ONBOARDING
   Worker signs up → enters city, delivery zone, avg weekly earnings
   → AI generates risk profile → weekly premium quoted instantly

2. POLICY ACTIVATION
   Worker reviews coverage → pays weekly premium (UPI/wallet)
   → Policy activated for the week → Coverage begins

3. REAL-TIME MONITORING (Background, always-on)
   OpenWeatherMap API → monitors rainfall, heat, AQI every 30 min
   Civic Alert Feed → monitors curfew/strike notifications
   GPS Activity Data → tracks worker's active hours

4. DISRUPTION DETECTED (Parametric Trigger)
   Trigger conditions met (e.g., rainfall > 25mm/hr for 2+ hours)
   → System logs disruption event with timestamp + location
   → Fraud checks run automatically (GPS validation, duplicate check)

5. CLAIM AUTO-INITIATED
   Zero-touch claim created → AI approves/flags within seconds
   → Worker notified via app push notification
   → Payout processed to UPI within 5 minutes

6. DASHBOARD
   Worker sees: protected earnings, active coverage, claim history
   Admin sees: loss ratios, disruption heatmaps, fraud alerts
```

---

## 💰 Weekly Premium Model

Our pricing model is built on a **weekly subscription basis**, aligned with the typical payout cycle of gig workers. Premiums are dynamic and calculated using AI based on hyper-local risk factors.

### Base Weekly Premium Structure

| Coverage Tier | Weekly Premium | Max Weekly Payout | Best For |
|--------------|---------------|-------------------|----------|
| Basic Shield | ₹29/week | ₹300/disruption day | Casual riders (<4 hrs/day) |
| Standard Shield | ₹59/week | ₹500/disruption day | Regular riders (4–8 hrs/day) |
| Pro Shield | ₹99/week | ₹800/disruption day | Full-time riders (8+ hrs/day) |

### AI-Adjusted Premium Factors

The weekly premium is dynamically adjusted using our ML risk scoring model:

| Factor | Adjustment |
|--------|-----------|
| Zone historically flood-prone | +₹10–₹20/week |
| Zone historically low-risk (dry belt) | −₹5–₹15/week |
| Worker tenure > 6 months (low churn risk) | −₹5/week |
| Predicted high-disruption week (weather forecast) | +₹10/week |
| Worker claims history (low claims = loyalty discount) | −₹5/week |

> **Example:** Raju operates in Indiranagar, Bangalore — a flood-prone zone. His base Standard Shield is ₹59/week, adjusted to ₹72/week after zone risk. He gets a ₹5 loyalty discount after 3 claim-free months. Net: ₹67/week.

### Why Weekly (Not Monthly)?
- Gig workers are paid weekly by platforms
- Workers can opt out or upgrade week-to-week based on their income
- Reduces affordability barrier for low-income workers
- Matches disruption seasonality (monsoon weeks = higher risk = workers can upgrade)

---

## ⚡ Parametric Triggers (Claim Conditions)

Unlike traditional insurance, ShieldRide uses **parametric triggers** — objective, measurable thresholds. No claim forms. No investigations. No delays.

| Trigger Type | Parameter | Threshold | Data Source |
|-------------|-----------|-----------|-------------|
| Heavy Rain | Rainfall intensity | > 25mm/hr sustained for 2+ hrs | OpenWeatherMap API |
| Flood Alert | Official flood warning issued | Level 2+ alert in worker's city | India Meteorological Dept. API |
| Extreme Heat | Temperature | > 44°C for 4+ consecutive hours | OpenWeatherMap API |
| Severe Pollution | AQI Index | AQI > 400 (Severe category) | AQICN API |
| Civic Disruption | Curfew/bandh | Official curfew in worker's zone | Government/News Alert API (mock) |

> **Important:** We insure **LOSS OF INCOME only**. No health, no vehicle repair, no accident coverage — strictly excluded.

---

## 🤖 AI/ML Integration Plan

### 1. Dynamic Premium Calculation (ML Model)
- **Model type:** Gradient Boosted Regression (XGBoost)
- **Training data:** 3-year historical weather data per pincode (IMD open data), historical delivery order volumes during disruptions
- **Features:** Zone, season, historical disruption frequency, worker profile, platform activity hours
- **Output:** Risk score (0–100) → mapped to weekly premium adjustment
- **Retraining:** Weekly, using new weather and claims data

### 2. Fraud Detection (Anomaly Detection)
- **GPS Validation:** Cross-check worker's GPS trail during claimed disruption period. If worker was active and moving during a "disruption window," flag for review.
- **Order Activity Check:** If platform API shows worker received orders during a weather disruption claim, auto-reject with reason code.
- **Duplicate Prevention:** Unique claim ID per disruption event per zone — prevents same event being claimed twice.
- **Anomaly Scoring:** Isolation Forest model trained on historical claim patterns to detect outlier claim behavior.

### 3. Predictive Risk Modelling
- 7-day ahead weather forecast → predict weeks with high disruption probability
- Pre-emptively notify workers to upgrade their coverage tier before high-risk weeks
- Helps insurer manage reserve funds proactively

---

## 🖥️ Platform Decision: Web App (Progressive Web App)

**Chosen: Web (PWA — Progressive Web App)**

**Justification:**
- Works on any Android/iOS device without app store download
- Can be saved to home screen for app-like experience
- No Play Store approval delays for iterative updates during competition
- Workers primarily use Chrome on Android — PWA is seamless
- Offline capability for areas with poor connectivity

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (PWA) — responsive mobile-first UI
- **Tailwind CSS** — rapid styling
- **React Query** — data fetching & caching

### Backend
- **Node.js + Express** — REST API server
- **JWT Authentication** — secure worker sessions

### Database
- **MongoDB Atlas** (Free tier) — worker profiles, policies, claims
- **Redis** — real-time trigger event caching

### AI/ML
- **Python (Flask microservice)** — premium calculation model
- **scikit-learn / XGBoost** — risk scoring and fraud detection
- **Pandas + NumPy** — data processing

### External APIs
- **OpenWeatherMap API** (Free tier) — real-time weather + forecasts
- **AQICN API** (Free) — AQI data for pollution triggers
- **IMD Open Data** — historical weather data for ML training
- **Razorpay Test Mode** — simulated payout processing
- **Twilio (Free tier)** — SMS/WhatsApp notifications

### DevOps
- **GitHub** — version control + CI/CD
- **Render / Railway** — free tier deployment
- **Docker** — containerisation

---

## 📋 Development Plan (6-Week Roadmap)

### Phase 1 — Weeks 1–2: Ideation & Foundation (Current Phase)
- [x] Define persona and problem scope
- [x] Design application workflow and data models
- [x] Define parametric triggers and premium model
- [ ] Set up GitHub repo and project structure
- [ ] Build wireframes / basic UI mockup
- [ ] Implement basic worker onboarding flow (frontend + backend)
- [ ] Connect OpenWeatherMap API (proof of concept)
- [ ] Record 2-minute strategy video

### Phase 2 — Weeks 3–4: Automation & Protection
- [ ] Complete registration + policy management module
- [ ] Implement dynamic premium calculator (ML model v1)
- [ ] Build 3–5 automated parametric triggers
- [ ] Implement claims management system
- [ ] Basic fraud detection (rule-based checks)
- [ ] Zero-touch claim initiation flow
- [ ] Record 2-minute demo video

### Phase 3 — Weeks 5–6: Scale & Optimise
- [ ] Advanced fraud detection (ML anomaly model)
- [ ] Instant payout simulation (Razorpay test mode)
- [ ] Worker dashboard (earnings protected, weekly coverage status)
- [ ] Admin/Insurer dashboard (loss ratios, predictive analytics)
- [ ] Performance optimisation and bug fixes
- [ ] Final pitch deck preparation
- [ ] Record 5-minute final demo video

---

## 👥 Team Structure

| Role | Responsibility |
|------|---------------|
| Frontend Developer | React PWA — onboarding, dashboard, policy UI |
| Backend Developer | Node.js APIs — auth, policies, claims management |
| ML Engineer | Premium calculator model, fraud detection |
| Integration Engineer | Weather APIs, parametric trigger engine |
| Full-Stack + Demo Lead | Fraud rules, admin dashboard, pitch deck, video |

---

## 📁 Repository Structure

```
shieldride/
├── client/                  # React PWA frontend
│   ├── src/
│   │   ├── pages/           # Onboarding, Dashboard, Policy, Claims
│   │   ├── components/      # Reusable UI components
│   │   └── services/        # API integration layer
├── server/                  # Node.js + Express backend
│   ├── routes/              # Auth, Policy, Claims, Triggers
│   ├── models/              # MongoDB schemas
│   └── middleware/          # Auth, validation
├── ml/                      # Python ML microservice
│   ├── premium_model/       # XGBoost risk scoring
│   └── fraud_detection/     # Anomaly detection model
├── triggers/                # Parametric trigger engine
│   ├── weather_monitor.js   # OpenWeatherMap polling
│   └── claim_processor.js   # Auto claim initiation
├── docs/                    # Architecture diagrams, API docs
└── README.md
```

---

## 🚫 Explicitly Excluded Coverage

As mandated by the problem statement, ShieldRide strictly excludes:
- ❌ Health insurance or medical reimbursements
- ❌ Life insurance or accidental death coverage
- ❌ Vehicle repair, maintenance, or damage
- ❌ Accident medical bills
- ❌ Equipment loss or theft

**We only insure lost income caused by qualifying parametric disruption events.**

---

## 🎯 Why ShieldRide Will Win

1. **Genuinely solves a real problem** — 5M+ workers are unprotected today
2. **Parametric model = scalable, no claims processing overhead**
3. **AI-first pricing** — fair, personalised, and fraud-resistant
4. **Zero-touch UX** — built for workers who have no time for paperwork
5. **Weekly model** — matches how gig workers actually live and earn

---

*Built with ❤️ for India's gig workers | Guidewire DEVTrails 2026*
