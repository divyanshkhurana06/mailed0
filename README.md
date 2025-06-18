# Mailed - Smart Email Assistant

A modern email client that automatically categorizes and summarizes your Gmail messages using AI.

## Features

- 🔄 Real-time Gmail integration
- 🤖 AI-powered email summarization
- 📊 Email tracking and analytics
- 🔔 Live browser notifications
- 🎨 Beautiful, modern UI with Tailwind CSS

## Tech Stack

- Frontend: Vite + React + Tailwind CSS
- Backend: Node.js + Express
- Database: Supabase
- Authentication: Google OAuth
- AI: OpenAI GPT-4
- Email: Gmail API

## Prerequisites

- Node.js 18+
- Google Cloud Platform account
- OpenAI API key
- Supabase account

## Setup

1. Clone the repository:
```bash
git clone https://github.com/divyanshkhurana06/mailed0.git
cd mailed0
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

3. Set up environment variables:

Create `.env` files in both root and server directories:

Frontend (.env):
```
VITE_API_URL=http://localhost:3000/api
```

Backend (server/.env):
```
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Set up Google Cloud Platform:
   - Create a new project
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

5. Set up Supabase:
   - Create a new project
   - Run the SQL schema from `server/schema.sql`
   - Get your project URL and API keys

6. Start the development servers:

```bash
# Start backend server
cd server
npm run dev

# In a new terminal, start frontend
cd ..
npm run dev
```

7. Visit `http://localhost:5173` in your browser

## Development

- Frontend code is in the `src` directory
- Backend code is in the `server/src` directory
- Database schema is in `server/schema.sql`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 