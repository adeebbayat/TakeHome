const User = require('../models/userModel');

const userController = {};

userController.getAllUsers = async (req,res,next) => {
  User.find({})
  .then(users => {
    res.locals.users = users
    return next()
  }).catch(err => {
    return next({
      log: 'Error in userController.getAllUsers',
      message: {err: 'Error finding users'}
    })
  })
}

userController.getOneUser = async (req,res,next) => {
  const name = req.params['0']
  User.find({name})
  .then(user => {
    res.locals.user = user
    return next()
  }).catch(err => {
    return next({
      log: 'Error in userController.getOneUser',
      message: {err: 'Error finding user'}
    })
  })
}

userController.createUser = async (req,res,next) => { 
  const {name} = req.body
  User.create({name})
  .then(user => {
    res.locals.user = user
    return next()
  }).catch(err => {
    return next({
      log: 'Error in userController.createUser',
      message: {err: 'Error creating user'}
    })
  })
  return next()
}

userController.updateUser = async (req, res, next) => {
  const name = req.params['0'];
  const skills = req.body.skills;
  console.log(req.body.skills);

  // Ensure skills is an array
  if (!Array.isArray(skills)) {
    return next({
      log: 'Error in userController.updateUser',
      message: { err: 'Skills should be an array' }
    });
  }

  User.findOneAndUpdate(
    { name },
    { $set: { skills: skills } }, // Use $set to replace the entire skills array
    { new: true } // Return the updated document
  )
  .then(user => {
    res.locals.user = user;
    return next();
  })
  .catch(err => {
    return next({
      log: 'Error in userController.updateUser',
      message: { err: 'Error updating user' }
    });
  });
}


module.exports = userController