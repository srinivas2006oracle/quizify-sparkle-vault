
# Quiz Application API Server

This is a REST API server for the Quiz Application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quiz-app
   ```

3. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Quizzes

- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `GET /api/quizzes/search?term=search_term` - Search quizzes
- `POST /api/quizzes` - Create a new quiz
- `PUT /api/quizzes/:id` - Update a quiz
- `DELETE /api/quizzes/:id` - Delete a quiz

### Quiz Games

- `GET /api/quizgames` - Get all quiz games
- `GET /api/quizgames/:id` - Get quiz game by ID
- `POST /api/quizgames` - Create a new quiz game
- `PUT /api/quizgames/:id` - Update a quiz game
- `DELETE /api/quizgames/:id` - Delete a quiz game
- `POST /api/quizgames/:id/start` - Start a quiz game
- `POST /api/quizgames/:id/end` - End a quiz game
