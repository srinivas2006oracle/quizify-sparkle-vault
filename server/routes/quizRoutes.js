
const express = require('express');
const router = express.Router();
const { Quiz } = require('../models/quizModels');

// Helper to add id field for frontend compatibility
const addIdField = (doc) => {
  if (doc && doc._id) {
    const result = doc.toObject ? doc.toObject() : { ...doc };
    result.id = result._id.toString();
    return result;
  }
  return doc;
};

// GET all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    // Add id field for frontend compatibility
    const quizzesWithId = quizzes.map(quiz => addIdField(quiz));
    res.json(quizzesWithId);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(addIdField(quiz));
  } catch (error) {
    console.error(`Error fetching quiz ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search quizzes by title, description, or topics
router.get('/search', async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.json([]);
    }

    const quizzes = await Quiz.find({
      $or: [
        { quizTitle: { $regex: term, $options: 'i' } },
        { quizDescription: { $regex: term, $options: 'i' } },
        { quizTopicsList: { $in: [new RegExp(term, 'i')] } }
      ]
    });
    
    const quizzesWithId = quizzes.map(quiz => addIdField(quiz));
    res.json(quizzesWithId);
  } catch (error) {
    console.error('Error searching quizzes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE a new quiz
router.post('/', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    const savedQuiz = await quiz.save();
    res.status(201).json(addIdField(savedQuiz));
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a quiz
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(addIdField(updatedQuiz));
  } catch (error) {
    console.error(`Error updating quiz ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a quiz
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(`Error deleting quiz ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
