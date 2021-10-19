const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
// const db = require('/db/db.json');
const db = require('./db/db.json');

// Helper method for generating unique ids
// const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// console.log(db[5])
// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET Route for retrieving all the tips
app.get('/api/tips', (req, res) => {
  console.info(`${req.method} request received for tips`);
  readFromFile('./db/tips.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new UX/UI tip
app.post('/api/tips', (req, res) => {
  console.info(`${req.method} request received to add a tip`);

  const { username, topic, tip } = req.body;

  if (req.body) {
    const newTip = {
      username,
      tip,
      topic,
      tip_id: uuid(),
    };

    readAndAppend(newTip, './db/tips.json');
    res.json(`Tip added successfully 🚀`);
  } else {
    res.error('Error in adding tip');
  }
});

// GET Route for retrieving all the feedback
app.get('/api/feedback', (req, res) => {
  console.info(`${req.method} request received for feedback`);

  readFromFile('./db/feedback.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for submitting feedback
app.post('/api/feedback', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit feedback`);

  // Destructuring assignment for the items in req.body
  const { email, feedbackType, feedback } = req.body;

  // If all the required properties are present
  if (email && feedbackType && feedback) {
    // Variable for the object we will save
    const newFeedback = {
      email,
      feedbackType,
      feedback,
      feedback_id: uuid(),
    };

    readAndAppend(newFeedback, './db/feedback.json');

    const response = {
      status: 'success',
      body: newFeedback,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

//TIPS ROUTES
// POST Route for a new UX/UI tip
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a tip`);
  console.log(req.body)
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      id: db[db.length - 1].id + 1 || 1,//BOOMARK ARRAY[ARRAY.LENGTH()].ID + 1 
      title,
      text
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Tip added successfully 🚀`);
  } else {
    res.error('Error in adding tip');
  }
});

//tip route get tip. 
// GET Route for retrieving all the tips
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for tips`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//tip route get tip. 
// GET Route for retrieving all the tips
app.get('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received for tips`);
  res.json(notes[id])
});

//delete route for deleting a note
//go into the db.json and get rid of the note so that the new list of notes can render to the frontend
app.delete('/api/notes/:id', (req, res) => {
  console.log(req.params)
  // console.info(`${req.method} request received for tips`);
  // console.log(`/api/notes/${id}`)

  db.find((element, index) => {
    console.log(element)
    if (element.id == req.params.id) {
      console.log("it worked!!!!")
      db.splice(index, 1)
      writeToFile('./db/db.json', db)
      
    }

  })

  const myid = db.find(element =>  req.params.id == element.id)
  // console.log(element.id)
  res.json(true)
  //readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});
