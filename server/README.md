# African Nations League Backend

Backend API for managing the African Nations League tournament. Built with Node.js, Express, and MongoDB using a modular MVC architecture.

## Features
- User registration and authentication with JWT and bcrypt
- Federation team management with full CRUD and automatic team rating calculation
- Tournament management with bracket generation, match simulation, and progression logic
- AI-assisted match commentary (OpenAI integration with graceful fallback)
- Email notifications for match summaries (via Nodemailer)
- Leaderboard for top goal scorers

## Project Structure
```
/server
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── server.js
├── package.json
└── README.md
```

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example`.
3. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:4000` by default.

## Testing
Use an API client such as Postman to interact with the provided routes. Ensure MongoDB is running and accessible via the `MONGO_URI` connection string.

## License
MIT
