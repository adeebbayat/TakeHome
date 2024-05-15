const Skill = require('../models/skillModel');

const skillController = {};

skillController.getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({});
    res.locals.skills = skills;
    return next();
  } catch (err) {
    return next('Error in skillController.getAllSkills: ' + JSON.stringify(err));
  }
};

skillController.createSkill = async (req, res, next) => {
  console.log(req)
  const { name } = req.body;
  console.log(name)
  try {
    await Skill.create({name});
    return next();
  } catch (err) {
    return next('Error in skillController.createSkill: ' + JSON.stringify(err));
  }
};

module.exports = skillController