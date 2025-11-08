# Shoepao Chatbot

Shoepao is a full-stack AI-powered assistant that helps customers explore the brand’s sneaker-inspired steamed buns. The project combines a Django REST backend with a React + Vite + Material UI frontend to deliver a real-time chat experience.

## Features
- Conversational interface with assistant responses driven by the backend chatbot service
- Conversation history with searchable sidebar and draft chat flow
- Responsive UI featuring rotating hero imagery and glassmorphism styling
- Robust error handling, loading indicators, and toast notifications

## Tech Stack
- **Frontend:** React, Vite, TypeScript, Material UI
- **Backend:** Django, Django REST Framework
- **Tooling:** Pipenv, npm, Axios, ESLint, Prettier

## Prerequisites
- Python 3.10+ with [Pipenv](https://pipenv.pypa.io/en/latest/)
- Node.js 18+ and npm
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-org>/shoepao.git
   cd shoepao
   ```

2. **Create and activate the Python environment**
   ```bash
   pipenv install
   pipenv shell
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` in the project root.
   - Fill in API keys, database URLs, and any other required secrets.

4. **Bootstrap the backend (`/backend`)**
   ```bash
   cd backend
   pipenv run python manage.py migrate
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/`.

5. **Start the frontend (`/frontend`)**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Vite will serve the UI at [http://localhost:5173/](http://localhost:5173/).

6. **Open the app**
   - Visit `http://localhost:5173/` in your browser.
   - Ensure the backend is still running so the chatbot can respond.

## Environment Variables
- `.env.example` documents every variable the application needs.
- Keep secrets out of source control by committing only the example file.
- Both backend and frontend read from environment settings—restart each service after changes.

## Project Structure
```
backend/         Django project and chatbot app
frontend/        Vite + React frontend
  public/        Static assets (rotating background images)
  src/           Components, context, services, and theme
```

## Developer Credits
These credits match the footer inside `ConversationList.tsx` lines 128–161:

- Developed by **Shoepao Team**
- [Nino Jr Garingarao](https://www.facebook.com/nigel.garingarao)
- [Justine Ferrer](https://www.facebook.com/justineferrer24#)

## Contributing
1. Fork the repository and create a feature branch.
2. Follow the setup steps above.
3. Run linting and tests before opening a pull request.
4. Provide screenshots or screen recordings for UI changes.

## Testing
- **Backend:** `cd backend && pipenv run python manage.py test`
- **Frontend:** `cd frontend && npm test` (add tests as the project grows)

## Troubleshooting
- Backend errors often stem from missing `.env` values—double-check the configuration.
- If dependencies fail to install, ensure you’re using the recommended Python and Node versions.
- For CORS or network errors in the frontend, verify the backend server is running on port 8000.

## License
This project is licensed under the [MIT License](./LICENSE).

