const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userController = require('./controllers/userController');
const skillController = require('./controllers/skillController');
const app = express();
const port = process.env.PORT || 5002;

const mongoURI = 'mongodb+srv://username:eEsYcktqhWGNJYFj@cluster0.hh5fdrv.mongodb.net/takeHome?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Skills
app.get('/skills', skillController.getAllSkills, (req, res) => {
  res.send(res.locals.skills);
});

app.post('/skills', skillController.createSkill, (req, res) => {
  res.send('Successfully Created');
});

// Users
app.get('/users', userController.getAllUsers, (req, res) => {
  res.send(res.locals.users);
});

app.get('/users/*', userController.getOneUser, (req, res) => {
  res.send(res.locals.user);
});

app.post('/users', userController.createUser, (req, res) => {
  res.send('Successfully Created');
});

app.put('/users/*', userController.updateUser, (req, res) => {
  res.send('Updated');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
