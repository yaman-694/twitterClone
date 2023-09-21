import joi from 'joi';

export const authSchema = joi.object({
    email: joi.string().email(),
    username: joi.string().alphanum(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword: joi.ref('password'),
    firstName: joi.string().min(4),
    lastName: joi.string().min(4),
}).with('password', 'confirmPassword').required();

export const loginSchema = joi.object({
    email: joi.string(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
}).required()