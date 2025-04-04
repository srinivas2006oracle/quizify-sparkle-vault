
const mongoose = require('mongoose');
const { Schema } = mongoose;

const AllResponseSchema = new Schema({
  ytMessage: String, //snippet.displayMessage
  ytChannelId: String, //authorDetails.channelId
  ytProfilePicUrl: String, //authorDetails.profileImageUrl
  ytUserName: String, //authorDetails.displayName
  ytPubTimeStamp: { type: Date, default: Date.now }, //snippet.publishedAt
  fetchTimeStamp: { type: Date, default: Date.now }, //addedAt
  delayTime: String, //difference between systemTimeStamp
});

const ResponseSchema = new Schema({
  ytChannelId: String,
  ytProfilePicUrl: String,
  userName: String,
  firstName: String,
  lastName: String,
  ytTimeStamp: { type: Date, default: Date.now },
  systemTimeStamp: { type: Date, default: Date.now },
  responseTime: String,
});

const ChoiceSchema = new Schema({
  choiceIndex: Number,
  choiceText: String,
  choiceImageurl: String,
  choiceResponses: [ResponseSchema],
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
  activeQuestionIndex: { type: Number, min: 0 },
  questionStartedAt: Date,
  isQuestionOpen: Boolean,
  correctChoiceIndex: { type: Number, min: -1 },
  liveIDs: [String],
  liveChatdIDs: [String],
  isGameOpen: Boolean,
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  questions: [QuestionSchema]
});

const Choice = mongoose.model('Choice', ChoiceSchema);
const Question = mongoose.model('Question', QuestionSchema);
const Quiz = mongoose.model('Quiz', QuizSchema);
const QuizGame = mongoose.model('QuizGame', QuizGameSchema);
const Response = mongoose.model('Response', ResponseSchema);
const AllResponse = mongoose.model('AllResponseSchema', AllResponseSchema);
module.exports = { Choice, Question, Quiz, QuizGame, Response , AllResponse};
