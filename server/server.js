const express = require('express')
const skillController = require('./controllers/skillController')
const userController = require('./controllers/userController')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const PORT = 3001;

const app = express();

const mongoURI = 'mongodb+srv://username:eEsYcktqhWGNJYFj@cluster0.hh5fdrv.mongodb.net/takeHome?retryWrites=true&w=majority&appName=Cluster0'
require('dotenv').config();
mongoose.connect(mongoURI)

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/skills', skillController.getAllSkills, (req,res) => {
  return res.send(res.locals.skills)
})

app.post('/skills', skillController.createSkill, (req,res) => {
  return res.json('Succesfully Created')
})

app.get('/users/*', userController.getOneUser, (req,res) => {
  return res.send(res.locals.user)
})

/**
 * 404 handler
 */
app.use('*', (req,res) => {
  res.status(404).send('Not Found');
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ error: err });
});

app.listen(PORT, ()=>{ console.log(`Listening on port ${PORT}...`); });

module.exports = app;