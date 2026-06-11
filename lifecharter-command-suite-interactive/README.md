# LifeCharter Command Suite - Interactive

A fully interactive, password-protected LifeCharter Command Suite application with user authentication, data persistence, and real-time progress tracking.

## Features

### Authentication & Security
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Session management with HTTP-only cookies
- Protected API routes

### Interactive Assessments
- **Brain.md Assessment**: Business identity, model, and strategic foundation (15 questions)
- **Soul.md Assessment**: Personal values, life vision, and alignment patterns (27 questions)
- Progress saving per question
- Section-based navigation
- Progress tracking with visual indicators

### AI Agent Management
- Create up to 5 custom AI agents
- Define agent roles (Content Creator, Sales Assistant, Client Support, Operations, Custom)
- Agent activation/deactivation

### Content Calendar
- Schedule content across platforms
- Track content status (draft, scheduled, published)
- Content type support (social, email, article, video, podcast)

### Dashboard & Analytics
- Real-time progress overview
- Module completion tracking
- Activity feed
- Statistics and metrics

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (file-based)
- **Authentication**: JWT tokens, bcrypt
- **Frontend**: Vanilla JavaScript, CSS3
- **Deployment**: Vercel (serverless functions)

## Local Development

### Prerequisites
- Node.js 18+ installed

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Edit `.env` and set your JWT secret:
```
JWT_SECRET=your-super-secret-key-here
PORT=3000
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

### Default Admin Credentials (for testing)
After registering, you can use any email/password combination. The app creates a new user on first registration.

## Deployment to Vercel

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

Follow the prompts to configure your project.

### Step 4: Set Environment Variables
In the Vercel dashboard or via CLI:
```bash
vercel env add JWT_SECRET
```

Enter a secure random string when prompted.

### Step 5: Redeploy
```bash
vercel --prod
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Assessments
- `GET /api/assessments/brain/questions` - Get Brain.md questions
- `GET /api/assessments/brain/progress` - Get Brain.md progress
- `POST /api/assessments/brain/answer` - Save Brain.md answer
- `GET /api/assessments/soul/questions` - Get Soul.md questions
- `GET /api/assessments/soul/progress` - Get Soul.md progress
- `POST /api/assessments/soul/answer` - Save Soul.md answer
- `GET /api/assessments/results` - Get all assessment results

### AI Agents
- `GET /api/ai-agents` - List agents
- `POST /api/ai-agents` - Create agent
- `GET /api/ai-agents/:id` - Get agent details
- `PUT /api/ai-agents/:id` - Update agent
- `DELETE /api/ai-agents/:id` - Delete agent

### Content Calendar
- `GET /api/content-calendar` - List content
- `POST /api/content-calendar` - Create content
- `GET /api/content-calendar/:id` - Get content details
- `PUT /api/content-calendar/:id` - Update content
- `DELETE /api/content-calendar/:id` - Delete content

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/activity` - Get activity feed

## Database Schema

### Tables
- `users` - User accounts
- `brain_assessments` - Brain.md answers
- `soul_assessments` - Soul.md answers
- `module_progress` - Module completion tracking
- `ai_agents` - AI agent configurations
- `content_calendar` - Content calendar items
- `user_settings` - User preferences
- `activity_log` - Activity tracking

## File Structure

```
lifecharter-command-suite-interactive/
├── api/
│   ├── index.js              # Main Express app
│   ├── database.js           # SQLite database setup
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   └── routes/
│       ├── auth.js           # Auth routes
│       ├── assessments.js    # Assessment routes
│       ├── modules.js        # Module routes
│       ├── ai-agents.js      # AI agent routes
│       ├── content-calendar.js # Content routes
│       └── activity.js       # Activity routes
├── public/
│   ├── index.html            # Main HTML
│   └── app.js                # Frontend JavaScript
├── package.json
├── vercel.json               # Vercel configuration
├── .env.example
└── README.md
```

## Brand Colors

The app uses the LifeCharter brand palette:
- **Deep Indigo**: #1F315B
- **Royal Plum**: #5E3B6C
- **Sacred Teal**: #2E7C83
- **Soft Lavender**: #CDBED6
- **Warm Gold**: #D4AF63
- **Ivory Light**: #F6F1E8
- **Soft Taupe**: #B9A9A9

## Notes

- SQLite database is stored in `/tmp` on Vercel (ephemeral, resets on each deployment)
- For production with persistent data, consider migrating to PostgreSQL or MongoDB
- JWT tokens expire after 7 days
- Maximum 5 AI agents per user

## License

Private - For LifeCharter Command Suite use only