
# EcoQuest - Next.js Full Project (Demo)

This archive contains a full **Next.js** project implementing the EcoQuest frontend (modern, ML-enabled) and backend API routes backed by **MongoDB (Mongoose)**.  
Features:
- Advanced React frontend with browser-side ML (TensorFlow.js MobileNet image classifier).
- Simple AI assistant proxy endpoint that forwards prompts to OpenAI (requires `OPENAI_API_KEY`).
- API routes for register/login, resources, challenges, submissions, competitions, union docs, leaderboard, quiz scoring, and certificate.
- Local file uploads saved to `/uploads` (good for local dev). For production (Vercel) you should use S3/Cloudinary.

## Quick start (local)

1. Install Node.js (v18+) and npm.
2. Unzip the project and `cd ecoquest-next`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create `.env.local` in project root with:
   ```
   MONGODB_URI="your_mongodb_atlas_connection_string"
   SECRET_KEY="replace_with_strong_secret"
   OPENAI_API_KEY="OPTIONAL_your_openai_api_key_for AI assistant"
   ```
   - If you don't have MongoDB, you can create a free cluster at https://www.mongodb.com/atlas.
5. Start dev server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` to view the frontend.

## Deploy to Vercel

1. Push to GitHub.
2. Import repo into Vercel.
3. Set environment variables in Vercel: `MONGODB_URI`, `SECRET_KEY`, and optionally `OPENAI_API_KEY`.
4. Deploy.
> Note: Vercel's serverless functions have ephemeral disk storage — uploaded files in `/uploads` will not persist. Use S3 or Cloudinary for production file storage.

## Notes & Next Steps
- This is a demo scaffold. I recommend converting the large frontend into proper React components/pages and adding authentication flows (store JWT, protect uploads).
- For production file storage, replace local saving logic in `pages/api/*` with S3/Cloudinary SDK.
- Add validation, rate limiting, and stronger CORS rules before exposing publicly.

If you'd like, I can:
- Replace local uploads with Cloudinary integration and update the code.
- Convert the entire frontend into modular React components with nicer UI (Tailwind + shadcn).
- Provide a ready-to-deploy GitHub repo instead of a ZIP.

