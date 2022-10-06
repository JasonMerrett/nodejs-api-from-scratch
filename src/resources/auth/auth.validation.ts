import Joi from 'joi';

const createUser = Joi.object({
  firstName: Joi.string().max(30).required(),
  lastName: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().min(8).required(),
});

const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const update = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  role: Joi.string(),
  email: Joi.string(),
});

export default { createUser, login, update };
