
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// SEARCH quizzes by title, description, or topics
router.get('/search', async (req, res) => {
  try {
    const { term } = req.query;
    if (!term || !term.trim()) {
      const allQuizzes = await Quiz.find();
      const quizzesWithId = allQuizzes.map(quiz => addIdField(quiz));
      return res.json(quizzesWithId);
    }

    console.log(`Searching for term: "${term}"`);
    
    const quizzes = await Quiz.find({
      $or: [
        { quizTitle: { $regex: term, $options: 'i' } },
        { quizDescription: { $regex: term, $options: 'i' } },
        { quizTopicsList: { $elemMatch: { $regex: term, $options: 'i' } } }
      ]
    });
    
    console.log(`Found ${quizzes.length} quizzes matching term: "${term}"`);
    
    const quizzesWithId = quizzes.map(quiz => addIdField(quiz));
    res.json(quizzesWithId);
  } catch (error) {
    console.error('Error searching quizzes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE a new quiz
router.post('/', async (req, res) => {
  try {
    // Ensure each question has a correct answer marked
    const quizData = req.body;
    
    if (quizData.questions && quizData.questions.length > 0) {
      // Remove client-generated IDs to let MongoDB create proper ObjectIDs
      quizData.questions.forEach(question => {
        // Remove any client-side generated IDs that aren't valid ObjectIDs
        if (question.id) delete question.id;
        if (question._id && typeof question._id === 'string' && !question._id.match(/^[0-9a-fA-F]{24}$/)) {
          delete question._id;
        }
        
        // Also clean up choice IDs
        if (question.choices) {
          question.choices.forEach(choice => {
            if (choice.id) delete choice.id;
            if (choice._id && typeof choice._id === 'string' && !choice._id.match(/^[0-9a-fA-F]{24}$/)) {
              delete choice._id;
            }
          });
        }
        
        if (!question.choices.some(choice => choice.isCorrectChoice)) {
          throw new Error('Each question must have at least one correct answer marked');
        }
      });
    }
    
    const quiz = new Quiz(quizData);
    const savedQuiz = await quiz.save();
    res.status(201).json(addIdField(savedQuiz));
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPDATE a quiz
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure each question has a correct answer marked
    const quizData = req.body;
    
    if (quizData.questions && quizData.questions.length > 0) {
      // Clean up client-generated IDs
      quizData.questions.forEach(question => {
        // Remove any client-side generated IDs that aren't valid ObjectIDs
        if (question.id) delete question.id;
        if (question._id && typeof question._id === 'string' && !question._id.match(/^[0-9a-fA-F]{24}$/)) {
          delete question._id;
        }
        
        // Also clean up choice IDs
        if (question.choices) {
          question.choices.forEach(choice => {
            if (choice.id) delete choice.id;
            if (choice._id && typeof choice._id === 'string' && !choice._id.match(/^[0-9a-fA-F]{24}$/)) {
              delete choice._id;
            }
          });
        }
        
        if (!question.choices.some(choice => choice.isCorrectChoice)) {
          throw new Error('Each question must have at least one correct answer marked');
        }
      });
    }
    
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { ...quizData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(addIdField(updatedQuiz));
  } catch (error) {
    console.error(`Error updating quiz ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH a quiz (partial update)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // If updating questions, ensure each has a correct answer
    const patchData = req.body;
    
    if (patchData.questions && patchData.questions.length > 0) {
      // Clean up client-generated IDs
      patchData.questions.forEach(question => {
        // Remove any client-side generated IDs that aren't valid ObjectIDs
        if (question.id) delete question.id;
        if (question._id && typeof question._id === 'string' && !question._id.match(/^[0-9a-fA-F]{24}$/)) {
          delete question._id;
        }
        
        // Also clean up choice IDs
        if (question.choices) {
          question.choices.forEach(choice => {
            if (choice.id) delete choice.id;
            if (choice._id && typeof choice._id === 'string' && !choice._id.match(/^[0-9a-fA-F]{24}$/)) {
              delete choice._id;
            }
          });
        }
        
        if (!question.choices.some(choice => choice.isCorrectChoice)) {
          throw new Error('Each question must have at least one correct answer marked');
        }
      });
    }
    
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { ...patchData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(addIdField(updatedQuiz));
  } catch (error) {
    console.error(`Error patching quiz ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE a quiz
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json({ message: 'Quiz deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(`Error deleting quiz ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
