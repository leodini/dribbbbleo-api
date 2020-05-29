const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

signToken = (user) => {
  return JWT.sign(
    {
      iss: "dribllleclone",
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 30),
    },
    process.env.TOKEN_SECRET
  );
};

module.exports = {
  async signUp(req, res) {
    const { username, password, bio, email, avatar } = req.value.body;

    // const encryptedPassword = await bcrypt.hash(password, bcrypt.genSalt(10));
    const encryptedPassword = await bcrypt.hash(password, 10);

    if ((await User.findOne({ username })) || (await User.findOne({ email })))
      return res.status(403).json({ message: "user already exists" });

    const newUser = await User.create({
      username,
      password: encryptedPassword,
      bio,
      email,
      avatar,
    });

    const token = signToken(newUser);

    return res.json({ token });
  },
  async signIn(req, res) {
    const token = signToken(req.user);
    return res.json({ token });
  },
  async index(req, res) {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("posts")
      .populate("comments")
      .execPopulate();
    return res.json(user);
  },
};
