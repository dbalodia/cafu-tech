import Joi from 'joi';
import CustomError from '../../../../private/custom-error';
import MESSAGES from '../../vars/messages';

const saveMessageSchema = Joi.object().keys({
    message: Joi.string().required().error(new CustomError(400, `Message ${MESSAGES.JOI_STRING_MESSAGE}`)),
});

const searchMessageSchema = Joi.object().keys({
    assignedTo: Joi.object().keys({}).required().error(new CustomError(400, 'Assgined To Parameter Is Required')),
});

export const Validations = {
    saveMessageSchema,
    searchMessageSchema,
};

export default Validations;
