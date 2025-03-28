
const express = require('express');
const router = express.Router();
const { QuizGame, Quiz } = require('../models/quizModels');

// GET all quiz games
router.get('/', async (req, res) => {
  try {
    const quizGames = await QuizGame.find();
    res.json(quizGames);
  } catch (error) {
    console.error('Error fetching quiz games:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single quiz game by ID
router.get('/:id', async (req, res) => {
  try {
    const quizGame = await QuizGame.findById(req.params.id).populate('quizId');
    if (!quizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    res.json(quizGame);
  } catch (error) {
    console.error(`Error fetching quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
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
    }
    
    const quizGame = new QuizGame(req.body);
    const savedQuizGame = await quizGame.save();
    res.status(201).json(savedQuizGame);
  } catch (error) {
    console.error('Error creating quiz game:', error);
    res.status(500).json({ message: 'Server error' });
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
    
    res.json(updatedQuizGame);
  } catch (error) {
    console.error(`Error updating quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a quiz game
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuizGame = await QuizGame.findByIdAndDelete(req.params.id);
    
    if (!deletedQuizGame) {
      return res.status(404).json({ message: 'Quiz game not found' });
    }
    
    res.json({ message: 'Quiz game deleted successfully' });
  } catch (error) {
    console.error(`Error deleting quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
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
    quizGame.activeQuestionIndex = 0;
    
    const updatedQuizGame = await quizGame.save();
    res.json(updatedQuizGame);
  } catch (error) {
    console.error(`Error starting quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
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
    res.json(updatedQuizGame);
  } catch (error) {
    console.error(`Error ending quiz game ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
