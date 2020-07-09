const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

signToken = (user) => {
  return JWT.sign(
    {
      iss: "dribllleclone",
      sub: {
        username: user.username,
        avatar_url: user.avatar_url,
        user_id: user.id,
      },
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 30),
    },
    process.env.TOKEN_SECRET
  );
};

module.exports = {
  async signUp(req, res) {
    const { username, password, bio, email, avatar_url } = req.value.body;

    const encryptedPassword = await bcrypt.hash(password, 10);

    if ((await User.findOne({ username })) || (await User.findOne({ email })))
      return res.status(403).json({ message: "user already exists" });

    const newUser = await User.create({
      username,
      password: encryptedPassword,
      bio,
      email,
      avatar_url,
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
      .exec();
    return res.json(user);
  },
  async updateUser(req, res) {
    const user = req.user;
    const { username, bio, avatar_url } = req.body;

    if (!username) {
      return res.status(400).json({ msg: "you must provide a username" });
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, {
      username,
      avatar_url,
      bio,
    });

    const refreshToken = signToken(updatedUser);

    return res.json(refreshToken);
  },
  async follow(req, res) {
    const { _id } = req.user;
    const { id } = req.params;

    const user = await User.findById(_id);

    const targetUser = await User.findById(id).populate("posts").exec();

    if (user.following.includes(targetUser.id)) {
      user.following.pop(targetUser);
      targetUser.followers.pop(user);
    } else {
      user.following.push(targetUser);
      targetUser.followers.push(user);
    }

    await targetUser.save();
    await user.save();

    await targetUser;

    return res.json(targetUser);
  },
};
