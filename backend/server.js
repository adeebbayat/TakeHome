const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userController = require('./controllers/userController');
const skillController = require('./controllers/skillController');
const app = express();
const port = 5002;

const mongoURI = 'mongodb+srv://username:eEsYcktqhWGNJYFj@cluster0.hh5fdrv.mongodb.net/takeHome?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongoURI);

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Skills
  app.get('/skills', skillController.getAllSkills, (req, res) => {
    res.send(res.locals.skills);
  })

  app.post('/skills', skillController.createSkill, (req, res) => {
    res.send('Succesfully Created')
  })

// Users
  app.get('/users', userController.getAllUsers, (req, res) => {
    res.send(res.locals.users);
  })

  app.get(`/users/*`, userController.getOneUser, (req, res) => {
    res.send(res.locals.user);
  })

  app.post('/users', userController.createUser, (req, res) => {
    res.send('Succesfully Created')
  })

  app.put(`/users/*`, userController.updateUser, (req, res) => {
    res.send('Updated')
  })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;