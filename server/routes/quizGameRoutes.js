
const express = require('express');
const router = express.Router();
const { QuizGame, Quiz } = require('../models/quizModels');

// Helper to add id field for frontend compatibility
const addIdField = (doc) => {
  if (doc && doc._id) {
    const result = doc.toObject ? doc.toObject() : { ...doc };
    result.id = result._id.toString();
    return result;
  }
  return doc;
};

// GET all quiz games
router.get('/', async (req, res) => {
  try {
    const quizGames = await QuizGame.find();
    const quizGamesWithId = quizGames.map(game => addIdField(game));
    res.json(quizGamesWithId);
  } catch (error) {
    console.error('Error fetching quiz games:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// SEARCH quiz games by title
router.get('/search', async (req, res) => {
  try {
    const { term } = req.query;
    if (!term || !term.trim()) {
      const allGames = await QuizGame.find();
      const gamesWithId = allGames.map(game => addIdField(game));
      return res.json(gamesWithId);
    }

    console.log(`Searching for game term: "${term}"`);
    
    const games = await QuizGame.find({
      gameTitle: { $regex: term, $options: 'i' }
    });
    
    console.log(`Found ${games.length} games matching term: "${term}"`);
    
    const gamesWithId = games.map(game => addIdField(game));
    res.json(gamesWithId);
  } catch (error) {
    console.error('Error searching quiz games:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET a single quiz game by ID
router.get('/:id', async (req, res) => {
  try {
    const quizGame = await QuizGame.findById(req.params.id).populate('quizId');
    if (!quizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    res.json(addIdField(quizGame));
  } catch (error) {
    console.error(`Error fetching quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE a new quiz game
router.post('/', async (req, res) => {
  try {
    // Validate quiz ID if provided
    if (req.body.quizId) {
      const quiz = await Quiz.findById(req.body.quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Referenced quiz not found' });
      }
      
      // If no questions are provided but quizId is valid, copy questions from the quiz
      if (!req.body.questions || req.body.questions.length === 0) {
        req.body.questions = quiz.questions;
      }
    }
    
    const quizGame = new QuizGame(req.body);
    const savedQuizGame = await quizGame.save();
    res.status(201).json(addIdField(savedQuizGame));
  } catch (error) {
    console.error('Error creating quiz game:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPDATE a quiz game
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate quiz ID if provided
    if (req.body.quizId) {
      const quiz = await Quiz.findById(req.body.quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Referenced quiz not found' });
      }
    }
    
    const updatedQuizGame = await QuizGame.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedQuizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    
    res.json(addIdField(updatedQuizGame));
  } catch (error) {
    console.error(`Error updating quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH a quiz game (partial update)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate quiz ID if provided
    if (req.body.quizId) {
      const quiz = await Quiz.findById(req.body.quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Referenced quiz not found' });
      }
    }
    
    const updatedQuizGame = await QuizGame.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedQuizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    
    res.json(addIdField(updatedQuizGame));
  } catch (error) {
    console.error(`Error patching quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE a quiz game
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuizGame = await QuizGame.findByIdAndDelete(req.params.id);
    
    if (!deletedQuizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    
    res.json({ message: 'Quiz game deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(`Error deleting quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start a quiz game
router.post('/:id/start', async (req, res) => {
  try {
    const quizGame = await QuizGame.findById(req.params.id);
    
    if (!quizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    
    quizGame.gameStartedAt = new Date();
    quizGame.isGameOpen = true;
    quizGame.activeQuestionIndex = -1;
    
    const updatedQuizGame = await quizGame.save();
    res.json(addIdField(updatedQuizGame));
  } catch (error) {
    console.error(`Error starting quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// End a quiz game
router.post('/:id/end', async (req, res) => {
  try {
    const quizGame = await QuizGame.findById(req.params.id);
    
    if (!quizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    
    quizGame.gameEndedAt = new Date();
    quizGame.isGameOpen = false;
    quizGame.isQuestionOpen = false;
    
    const updatedQuizGame = await quizGame.save();
    res.json(addIdField(updatedQuizGame));
  } catch (error) {
    console.error(`Error ending quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start a question in the quiz game
router.post('/:id/question/:index/start', async (req, res) => {
  try {
    const quizGame = await QuizGame.findById(req.params.id);
    
    if (!quizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    
    const questionIndex = parseInt(req.params.index);
    if (questionIndex < 0 || questionIndex >= quizGame.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }
    
    quizGame.activeQuestionIndex = questionIndex;
    quizGame.questionStartedAt = new Date();
    quizGame.isQuestionOpen = true;
    
    const updatedQuizGame = await quizGame.save();
    res.json(addIdField(updatedQuizGame));
  } catch (error) {
    console.error(`Error starting question in quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// End a question in the quiz game
router.post('/:id/question/:index/end', async (req, res) => {
  try {
    const quizGame = await QuizGame.findById(req.params.id);
    
    if (!quizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    
    const questionIndex = parseInt(req.params.index);
    if (questionIndex < 0 || questionIndex >= quizGame.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }
    
    quizGame.isQuestionOpen = false;
    
    const updatedQuizGame = await quizGame.save();
    res.json(addIdField(updatedQuizGame));
  } catch (error) {
    console.error(`Error ending question in quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a response to a question's choice
router.post('/:id/question/:qIndex/choice/:cIndex/response', async (req, res) => {
  try {
    const quizGame = await QuizGame.findById(req.params.id);
    
    if (!quizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    
    const questionIndex = parseInt(req.params.qIndex);
    const choiceIndex = parseInt(req.params.cIndex);
    
    if (questionIndex < 0 || questionIndex >= quizGame.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }
    
    const question = quizGame.questions[questionIndex];
    
    if (choiceIndex < 0 || choiceIndex >= question.choices.length) {
      return res.status(400).json({ message: 'Invalid choice index' });
    }
    
    if (!quizGame.isQuestionOpen) {
      return res.status(400).json({ message: 'Question is closed for responses' });
    }
    
    // Add the response to the choice
    const response = req.body;
    
    // Calculate response time if not provided
    if (!response.responseTime && quizGame.questionStartedAt) {
      const now = new Date();
      const startTime = new Date(quizGame.questionStartedAt);
      const timeDiff = now.getTime() - startTime.getTime();
      response.responseTime = timeDiff.toString();
    }
    
    question.choices[choiceIndex].choiceResponses.push(response);
    
    await quizGame.save();
    
    res.status(201).json({ 
      message: 'Response added successfully',
      game: addIdField(quizGame)
    });
  } catch (error) {
    console.error(`Error adding response to quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
