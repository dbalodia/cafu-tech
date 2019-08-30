import Joi from 'joi';
import CustomError from '../../../../private/custom-error';

const userLoginSchema = Joi.object().keys({
    password: Joi.string().required().error(new CustomError(400, 'Password is required')),
    email: Joi.string().email().required().error(new CustomError(400, 'Email Is Required')),
});

const userCreationSchema = Joi.object().keys({
    password: Joi.string().required().error(new CustomError(400, 'Password is required')),
    email: Joi.string().email().required().error(new CustomError(400, 'Email Is Required')),
    firstName: Joi.string().required().error(new CustomError(400, 'FirstName Is Required')),
    lastName: Joi.string().required().error(new CustomError(400, 'LastName Is Required')),
});

export const Validations = {
    userLoginSchema,
    userCreationSchema,
};

export default Validations;
