const User = require('../models/userModel');

const userController = {};

userController.getOneUser = async (req,res,next) => {
  const {name} = req.params
  try {
    const user = await User.find({name})
    res.local.user = user;
    return next();
  } catch (err) {
    return next('Error in userController.getOneUser: ' + JSON.stringify(err));
  }
}

userController.createUser = async (req,res,next) => {
  const {name} = req.body
  try {
    await User.create({name});
    return next();
  } catch (err) {
    return next('Error in skillController.createSkill: ' + JSON.stringify(err));
  }
}
module.exports = userController