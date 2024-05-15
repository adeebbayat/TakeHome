const Skill = require('../models/skillModel');

const skillController = {};

skillController.getAllSkills = async (req,res,next) => {
  Skill.find({})
  .then(skills => {
    res.locals.skills = skills
    return next()
  }).catch(err => {
    return next({
      log: 'Error in skillController.getAllSkills',
      message: {err: 'Error finding skills'}
    })
  })
}

skillController.createSkill = async (req,res,next) => {
  const {name} = req.body
  Skill.create({name})
  .then(skill => {
    res.locals.skill = skill
    return next()
  }).catch(err => {
    return next({
      log: 'Error in skillController.createSkill',
      message: {err: 'Error creating skill'}
    })
  })
  return next()
}

module.exports = skillController