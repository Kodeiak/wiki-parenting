const express = require("express"),
      mongoose = require("mongoose"),
      models = require("./models.js"),
      bodyParser = require("body-parser");

const app = express(),
      topics = models.topic,
      users = models.user,
      books = models.book,
      podcasts = models.podcast,
      parentingApps = models.app,
      creators = models.creator,
      tweets = models.tweet;

const port = 8080;

mongoose.connect("mongodb://localhost:27017/wikiparenting", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Welcome page
app.get("/", (req, res) => {
  res.send("Welcome to Wiki-Parenting");
});

// get all users
app.get("/users", (req, res) => {
  users.find()
    .then( users => {
      res.status(200).json(users);
    })
    .catch( err => {
      res.status(404).send(`Error: ${err}`);
    });
});

// get all books
app.get("/books", (req, res) => {
  books.find()
    .then( books => {
      res.status(200).json(books);
    })
    .catch( err => {
      res.status(404).send(`Error: ${err}`);
    });
});

// get all podcasts
app.get("/podcasts", (req, res) => {
  podcasts.find()
    .then( podcasts => {
      res.status(200).json(podcasts);
    })
    .catch( err => {
      res.status(400).send(`Error: ${err}`);
    });
});

app.get("/tweets", (req, res) => {
  tweets.find()
    .then( tweets => {
      res.status(200).json(tweets);
    })
    .catch( err => {
      res.status(400).send(`Error: ${err}`);
    });
});

app.get("/topics", (req, res) => {
  topics.find()
    .then( topics => {
      res.status(200).json(topics);
    })
    .catch( err => {
      res.status(400).send(`Error: ${err}`);
    });
});

app.get("/apps", (req, res) => {
  parentingApps.find()
    .then( apps => {
      res.status(200).json(apps);
    })
    .catch( err => {
      res.status(400).send(`Error: ${err}`);
    });
});

app.get("/creators", (req, res) => {
  creators.find()
    .then( creators => {
      res.status(200).json(creators);
    })
    .catch( err => {
      res.status(400).send(`Error: ${err}`);
    });
});

// // return list of books by topic
// app.get("books/:topic/:topicName", (req, res) => {
//   books.find({ })
// })

// return a list of podcasts by topic

// return a list of tweets by hashtag
app.get("/tweets/:hashtag", (req, res) => {
  tweets.find({ hashtag: req.params.hashtag})
    .then( tweet => {
      res.status(200).json(tweet);
    })
    .catch( err => {
      res.status(400).json(`Error: ${err}`);
    });
});

// return topic by book
app.get("/books/topics/:title", (req, res) => {
  books.find({ title: req.params.title }, { "_id": 0, "topic": 1})
    .then( books => {
      res.status(200).json(books);
    })
    .catch( err => {
      res.status(400).send(`Error: ${err}`);
    });
});

// return topic by podcast
app.get("/podcasts/:title", (req, res) => {
  podcasts.find({ title: req.params.title }, { "_id": 0, "topic": 1})
    .then( topic => {
      res.status(200).json(topic);
    })
    .catch( err => {
      res.status(400).send(`Error: ${err}`);
    });
});
// return topics to follow by username
app.get("/users/topics/:username", (req, res) => {
  users.find({ username: req.params.username}, { "_id": 0, "topics": 1})
    .then( topic => {
      res.status(200).json(topic)
    })
    .catch( err => {
      res.status(400).send(`Error: ${err}`);
    });
});
// return book by title
app.get("/books/:title", (req, res) => {
  books.find({ title: req.params.title })
    .then( book => {
      res.status(200).json(book);
    })
    .catch( err => {
      res.status(400).send(`Error: ${err}`);
    });
});
// return content creator data by name
app.get("/creators/:name", (req, res) => {
  creators.find({ name: req.params.name })
    .then( creator => {
      res.status(200).json(creator);
    })
    .catch( err => {
      res.status(400).send(`Error: ${err}`);
    });
});
// allow new users to register
app.post("/users", (req, res) => {
  // check if user exists
  users.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    birthday: req.body.birthday,
    topics: req.body.topics
  })
    .then( user => {
      res.status(201).json(user);
    })
    .catch( err => {
      console.error(err);
      res.status(400).send(`Error: ${err}`);
    });
});
// allow users to login

// allow users to update their user info
app.put("/users/:username", (req, res) => {
  users.updateOne(
    { username: req.params.username },
    { 
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      birthday: req.body.birthday,
      topics: req.body.topics
    })
    .then( user => {
      res.status(200).json(user);
    })
    .catch( err => {
      console.error(err);
      res.status(400).send(`Error: ${err}`);
    });
});
// allow users to add topics to their follow list
app.put("/users/:username/topics/:topic", (req, res) => {
  users.findOneAndUpdate(
    { username: req.params.username },
    { $push: { topics: req.params.topic}},
    { new: true})
    .then( topic => {
      if (!topic) {
        res.status(400).send(`Topic, ${req.params.topic}, cannont be found.`);
      } else {
      res.status(201).send(`Topic, ${req.params.topic}, has been successfully added.`);
      }
    })
    .catch( err => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});
// allow users to remove topics from their follow list
app.delete("/users/:username/topics/:topic", (req, res) => {
  users.findOneAndUpdate(
    { username: req.params.username },
    { $pull: { topics: req.params.topic} },
    { new: true})
    .then( topic => {
      if (!topic) {
        res.status(400).send(`Topic, ${req.params.topic}, cannot be found.`);
      } else {
      res.status(201).send(`Topic, ${req.params.topic}, has been successfully removed.`);
      }
    })
    .catch( err => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});
// allow existing users to deregister
app.delete("/users/:username", (req, res) => {
  users.findOneAndRemove({ username: req.params.username })
    .then( user => {
      if (!user) {
        res.status(400).send(`${req.params.username} was not found.`);
      } else {
      res.status(200).send(`${req.params.username} has been successfully deleted.`);}
    })
     .catch( err => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.listen(port, () => console.log(`Wiki-parenting app is listening on port ${port}!`));
