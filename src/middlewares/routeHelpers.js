const Joi = require("joi");

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }
      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      next();
      //req.value.body instead req.body
    };
  },
  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      username: Joi.string().required(),
      bio: Joi.string(),
      avatar: Joi.string().allow(null, ""),
    }),
    postSchema: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string(),
      category: Joi.string().required(),
    }),
  },
};
