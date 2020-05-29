const JwtStrategy = require("passport-jwt").Strategy;
const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcrypt");
const { ExtractJwt } = require("passport-jwt");
const User = require("../models/User");

const authenticateToken = async (payload, done) => {
  const user = await User.findById(payload.sub);
  try {
    if (!user) {
      return done(null, false, { message: "no user found" });
    }
    done(null, user);
  } catch (err) {
    done(err, false);
  }
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.TOKEN_SECRET,
    },
    authenticateToken
  )
);

const authenticateUser = async (username, password, done) => {
  const user = await User.findOne({ username });
  try {
    if (!user) {
      return done(null, false);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err, false);
  }
};

passport.use(
  new localStrategy(
    {
      usernameField: "username",
    },
    authenticateUser
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  let user = await User.findById(id);
  return done(null, user);
});
