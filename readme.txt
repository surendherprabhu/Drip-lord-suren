# DRIP LORD AARIZ — Chatbot

## Local setup

1. Clone this repo.
2. Frontend: open `index.html` in your browser for local testing (it will try to talk to /api/chat).
3. Backend:
   - `cd` to the folder with `server.js`.
   - `npm install`.
   - Set environment variable: `export OPENAI_API_KEY="sk-..."` (Linux/macOS) or set in your hosting provider.
   - `npm start` to run locally on port 3000.
4. For local frontend testing, run a simple static server (e.g. `npx serve` or `python -m http.server`) OR update fetch URL in `script.js` to `http://localhost:3000/api/chat`.

## Deploying

- **Vercel / Netlify / Render / Railway**: Create a new project, upload code (or connect GitHub). Add `OPENAI_API_KEY` as a secret/env variable. Deploy backend as a serverless function (Vercel) or a Node service (Render).

- **GitHub Pages**: You can host the *frontend* on GitHub Pages, but the backend **must** run on a separate host — GitHub Pages cannot run server code. Point the frontend fetch calls to the deployed backend URL.

## Security tips

- Never commit `OPENAI_API_KEY` to Git.
- Use environment variables on the host to store secrets.
- Add proper authentication if your site should not be public.
- Consider request quotas, logging, and improved rate limiting in production.
