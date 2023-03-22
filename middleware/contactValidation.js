const Joi = require('joi');

const contactValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        phone: Joi.string().min(6).required()
    })
    return schema.validate(data);
}

module.exports.contactValidation = contactValidation;
