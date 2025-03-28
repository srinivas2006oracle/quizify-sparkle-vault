
import { Quiz } from "@/types/quiz";

export const sampleQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    quizTitle: "Web Development Fundamentals",
    quizDescription: "Test your knowledge of HTML, CSS, and JavaScript basics",
    quizTopicsList: ["HTML", "CSS", "JavaScript", "Web Development"],
    quizLanguage: "English",
    templateCategory: "Technology",
    youtubeChannel: "TechEdu",
    readyForLive: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-20T14:45:00Z",
    createdBy: "admin",
    updatedBy: "admin",
    questions: [
      {
        id: "q1-1",
        questionText: "What does HTML stand for?",
        questionTopicsList: ["HTML", "Web Development"],
        choices: [
          {
            choiceIndex: 0,
            choiceText: "Hyper Text Markup Language",
            isCorrectChoice: true
          },
          {
            choiceIndex: 1,
            choiceText: "High Tech Modern Language",
            isCorrectChoice: false
          },
          {
            choiceIndex: 2,
            choiceText: "Hyper Transfer Markup Language",
            isCorrectChoice: false
          },
          {
            choiceIndex: 3,
            choiceText: "Home Tool Markup Language",
            isCorrectChoice: false
          }
        ],
        correctChoiceIndex: 0,
        answerExplanation: "HTML stands for Hyper Text Markup Language. It is the standard markup language for creating web pages.",
        templateCategory: "Technology",
        difficultyLevel: "Easy",
        questionLanguage: "English",
        validatedManually: true,
        createdAt: "2023-01-15T10:35:00Z",
        updatedAt: "2023-01-15T10:35:00Z",
        createdBy: "admin",
        updatedBy: "admin"
      },
      {
        id: "q1-2",
        questionText: "Which property is used to change the background color in CSS?",
        questionTopicsList: ["CSS", "Web Development"],
        choices: [
          {
            choiceIndex: 0,
            choiceText: "color",
            isCorrectChoice: false
          },
          {
            choiceIndex: 1,
            choiceText: "bgcolor",
            isCorrectChoice: false
          },
          {
            choiceIndex: 2,
            choiceText: "background-color",
            isCorrectChoice: true
          },
          {
            choiceIndex: 3,
            choiceText: "background",
            isCorrectChoice: false
          }
        ],
        correctChoiceIndex: 2,
        answerExplanation: "The background-color property is used to specify the background color of an element in CSS.",
        templateCategory: "Technology",
        difficultyLevel: "Easy",
        questionLanguage: "English",
        validatedManually: true,
        createdAt: "2023-01-15T10:40:00Z",
        updatedAt: "2023-01-15T10:40:00Z",
        createdBy: "admin",
        updatedBy: "admin"
      },
      {
        id: "q1-3",
        questionText: "Which JavaScript method is used to add a new element to the end of an array?",
        questionTopicsList: ["JavaScript", "Web Development"],
        choices: [
          {
            choiceIndex: 0,
            choiceText: "push()",
            isCorrectChoice: true
          },
          {
            choiceIndex: 1,
            choiceText: "append()",
            isCorrectChoice: false
          },
          {
            choiceIndex: 2,
            choiceText: "add()",
            isCorrectChoice: false
          },
          {
            choiceIndex: 3,
            choiceText: "insert()",
            isCorrectChoice: false
          }
        ],
        correctChoiceIndex: 0,
        answerExplanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
        templateCategory: "Technology",
        difficultyLevel: "Medium",
        questionLanguage: "English",
        validatedManually: true,
        createdAt: "2023-01-15T10:45:00Z",
        updatedAt: "2023-01-15T10:45:00Z",
        createdBy: "admin",
        updatedBy: "admin"
      }
    ]
  },
  {
    id: "quiz-2",
    quizTitle: "Data Science Essentials",
    quizDescription: "Test your knowledge of data science concepts and tools",
    quizTopicsList: ["Data Science", "Python", "Statistics", "Machine Learning"],
    quizLanguage: "English",
    templateCategory: "Technology",
    youtubeChannel: "DataProfessor",
    readyForLive: true,
    createdAt: "2023-02-10T09:20:00Z",
    updatedAt: "2023-02-15T11:30:00Z",
    createdBy: "admin",
    updatedBy: "admin",
    questions: [
      {
        id: "q2-1",
        questionText: "Which Python library is commonly used for data manipulation and analysis?",
        questionTopicsList: ["Python", "Data Science"],
        choices: [
          {
            choiceIndex: 0,
            choiceText: "NumPy",
            isCorrectChoice: false
          },
          {
            choiceIndex: 1,
            choiceText: "Pandas",
            isCorrectChoice: true
          },
          {
            choiceIndex: 2,
            choiceText: "Matplotlib",
            isCorrectChoice: false
          },
          {
            choiceIndex: 3,
            choiceText: "TensorFlow",
            isCorrectChoice: false
          }
        ],
        correctChoiceIndex: 1,
        answerExplanation: "Pandas is a powerful Python library used for data manipulation and analysis, providing data structures like DataFrame for efficiently storing and manipulating tabular data.",
        templateCategory: "Technology",
        difficultyLevel: "Medium",
        questionLanguage: "English",
        validatedManually: true,
        createdAt: "2023-02-10T09:25:00Z",
        updatedAt: "2023-02-10T09:25:00Z",
        createdBy: "admin",
        updatedBy: "admin"
      },
      {
        id: "q2-2",
        questionText: "What is a confusion matrix used for?",
        questionTopicsList: ["Machine Learning", "Data Science", "Statistics"],
        choices: [
          {
            choiceIndex: 0,
            choiceText: "To visualize data distributions",
            isCorrectChoice: false
          },
          {
            choiceIndex: 1,
            choiceText: "To evaluate regression models",
            isCorrectChoice: false
          },
          {
            choiceIndex: 2,
            choiceText: "To evaluate classification models",
            isCorrectChoice: true
          },
          {
            choiceIndex: 3,
            choiceText: "To perform dimensionality reduction",
            isCorrectChoice: false
          }
        ],
        correctChoiceIndex: 2,
        answerExplanation: "A confusion matrix is used to evaluate the performance of a classification model by showing the counts of true positives, false positives, true negatives, and false negatives.",
        templateCategory: "Technology",
        difficultyLevel: "Hard",
        questionLanguage: "English",
        validatedManually: true,
        createdAt: "2023-02-10T09:30:00Z",
        updatedAt: "2023-02-10T09:30:00Z",
        createdBy: "admin",
        updatedBy: "admin"
      }
    ]
  },
  {
    id: "quiz-3",
    quizTitle: "Artificial Intelligence Fundamentals",
    quizDescription: "Learn about the basic concepts and applications of AI",
    quizTopicsList: ["Artificial Intelligence", "Machine Learning", "Neural Networks"],
    quizLanguage: "English",
    templateCategory: "Technology",
    youtubeChannel: "AIExplained",
    readyForLive: false,
    createdAt: "2023-03-05T14:20:00Z",
    updatedAt: "2023-03-10T16:45:00Z",
    createdBy: "admin",
    updatedBy: "admin",
    questions: [
      {
        id: "q3-1",
        questionText: "What is deep learning?",
        questionTopicsList: ["Artificial Intelligence", "Deep Learning", "Neural Networks"],
        choices: [
          {
            choiceIndex: 0,
            choiceText: "A type of computer hardware",
            isCorrectChoice: false
          },
          {
            choiceIndex: 1,
            choiceText: "A subset of machine learning using neural networks with many layers",
            isCorrectChoice: true
          },
          {
            choiceIndex: 2,
            choiceText: "A programming language for AI",
            isCorrectChoice: false
          },
          {
            choiceIndex: 3,
            choiceText: "A database management system for large datasets",
            isCorrectChoice: false
          }
        ],
        correctChoiceIndex: 1,
        answerExplanation: "Deep learning is a subset of machine learning that uses neural networks with multiple layers (deep neural networks) to analyze various factors of data.",
        templateCategory: "Technology",
        difficultyLevel: "Medium",
        questionLanguage: "English",
        validatedManually: true,
        createdAt: "2023-03-05T14:25:00Z",
        updatedAt: "2023-03-05T14:25:00Z",
        createdBy: "admin",
        updatedBy: "admin"
      },
      {
        id: "q3-2",
        questionText: "Which of the following is NOT a common type of neural network?",
        questionTopicsList: ["Neural Networks", "Artificial Intelligence"],
        choices: [
          {
            choiceIndex: 0,
            choiceText: "Convolutional Neural Network (CNN)",
            isCorrectChoice: false
          },
          {
            choiceIndex: 1,
            choiceText: "Recurrent Neural Network (RNN)",
            isCorrectChoice: false
          },
          {
            choiceIndex: 2,
            choiceText: "Quantum Neural Network (QNN)",
            isCorrectChoice: false
          },
          {
            choiceIndex: 3,
            choiceText: "Systematic Neural Network (SNN)",
            isCorrectChoice: true
          }
        ],
        correctChoiceIndex: 3,
        answerExplanation: "Systematic Neural Network (SNN) is a fictional type. Common types include CNN, RNN, GAN, and others, but SNN is not a standard neural network architecture.",
        templateCategory: "Technology",
        difficultyLevel: "Hard",
        questionLanguage: "English",
        validatedManually: true,
        createdAt: "2023-03-05T14:30:00Z",
        updatedAt: "2023-03-05T14:30:00Z",
        createdBy: "admin",
        updatedBy: "admin"
      }
    ]
  }
];

export const getQuizById = (id: string): Quiz | undefined => {
  return sampleQuizzes.find(quiz => quiz.id === id);
};

export const searchQuizzes = (searchTerm: string): Quiz[] => {
  if (!searchTerm) return sampleQuizzes;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return sampleQuizzes.filter(quiz => 
    quiz.quizTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
    quiz.quizDescription.toLowerCase().includes(lowerCaseSearchTerm) ||
    quiz.quizTopicsList.some(topic => topic.toLowerCase().includes(lowerCaseSearchTerm))
  );
};
