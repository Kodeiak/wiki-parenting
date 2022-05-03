const mongoose = require("mongoose");

// users, creators, books, podcasts, topics, apps

let topicsSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

let usersSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true},
  password: { type: String, required: true },
  birthday: Date,
  topics: [{type: mongoose.Schema.Types.ObjectId, ref: "topics"}]
});

let creatorsSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  bio: String,
  birth: Date,
  death: Date
});

let booksSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: [{ type: mongoose.Schema.Types.ObjectId, ref: "creators"}],
  datePublished: Date,
  topic: [{type: mongoose.Schema.Types.ObjectId, ref: "topics"}],
  description: String,
  rating: Number
});

let podcastsSchema = mongoose.Schema({
  title: { type: String, required: true },
  host: [{ type: mongoose.Schema.Types.ObjectId, ref: "creators"}],
  topic: [{type: mongoose.Schema.Types.ObjectId, ref: "topics"}],
  description: String,
  dateStarted: Date,
  active: Boolean,
  frequency: String,
  averageLengthMinutes: Number,
  rating: Number
});

let appsSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: String,
  downloadOn: String
});

let tweetsSchema = mongoose.Schema({
  tweet: { type: String, required: true },
  hashtag: { type: String, required: true }
});

// create instances of models
let topic = mongoose.model("topic", topicsSchema),
    user = mongoose.model("user", usersSchema),
    creator = mongoose.model("creator", creatorsSchema),
    book = mongoose.model("book", booksSchema),
    podcast = mongoose.model("podcast", podcastsSchema),
    app = mongoose.model("app", appsSchema),
    tweet = mongoose.model("tweet", tweetsSchema);

module.exports.topic = topic;
module.exports.user = user;
module.exports.creator = creator;
module.exports.book = book;
module.exports.podcast = podcast;
module.exports.app = app;
module.exports.tweet = tweet;