
const mongoose = require('mongoose');
const { Schema } = mongoose;

/* this is in the youtube stream scheduler app
const AllResponseSchema = new Schema({
  ytMessage: String, //snippet.displayMessage
  ytChannelId: String, //authorDetails.channelId
  ytProfilePicUrl: String, //authorDetails.profileImageUrl
  ytUserName: String, //authorDetails.displayName
  ytPubTimeStamp: { type: Date, default: Date.now }, //snippet.publishedAt
  fetchTimeStamp: { type: Date, default: Date.now }, //addedAt
  delayTime: String, //difference between systemTimeStamp
});
*/

const AnswerSchema = new Schema({
  ytChannelId: String,
  ytProfilePicUrl: String,
  userName: String,
  firstName: String,
  lastName: String,
  //ytTimeStamp: { type: Date, default: Date.now },
  //systemTimeStamp: { type: Date, default: Date.now },
  responseTime: String, //questionStartedAt -ytPubTimeStamp
  isCorrectAnswer: Boolean,
  quizGameId: { type: Schema.Types.ObjectId, ref: 'QuizGame' },
});

const ChoiceSchema = new Schema({
  choiceIndex: Number,
  choiceText: String,
  choiceImageurl: String,
  //choiceResponses: [ResponseSchema],
  isCorrectChoice: Boolean
});

const QuestionSchema = new Schema({
  questionText: String,
  questionImageUrl: String,
  questionTopicsList: [String],
  choices: [ChoiceSchema],
  answerExplanation: String,
  templateCategory: String,
  difficultyLevel: String,
  questionLanguage: String,
  validatedManually: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: String,
  updatedBy: String
});

const QuizSchema = new Schema({
  quizTitle: String,
  quizDescription: String,
  quizTopicsList: [String],
  quizLanguage: String,
  templateCategory: String,
  youtubeChannel: String,
  questions: [QuestionSchema],
  readyForLive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: String,
  updatedBy: String
});

const QuizGameSchema = new Schema({
  gameTitle: String,
  gameScheduledStart: Date,
  gameScheduledEnd: Date,
  gameStartedAt: Date,
  gameEndedAt: Date,
  activeQuestionIndex: { type: Number, min: -1 },
  questionStartedAt: Date,
  isQuestionOpen: Boolean,
  correctChoiceIndex: { type: Number, min: -1 },
  //liveIDs: [String],
  //liveChatdIDs: [String],
  isGameOpen: Boolean,
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  questions: [QuestionSchema],
  introImage: { type: String, default: '' }
});

const Question = mongoose.model('Question', QuestionSchema);
const Quiz = mongoose.model('Quiz', QuizSchema);
const QuizGame = mongoose.model('QuizGame', QuizGameSchema);
const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = { Question, Quiz, QuizGame, Answer };
