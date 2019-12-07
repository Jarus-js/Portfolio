const User = require("../models/User");
const configSec = require("../config/keys");
const bcrypt = require("bcryptjs");
const passport = require("passport"); //Library that we use to figure out whether user is currently authenticated or not to use our app & Strategy attempts to authenticate user with diff methods
const JwtStrategy = require("passport-jwt").Strategy; //Strategy => Method for authenticating user using different method like: jwt,email,passport,google,facebook
const ExtractJwt = require("passport-jwt").ExtractJwt;
const localStrategy = require("passport-local");

//Setup options for Jwt Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  //Telling Jwt Strategy whenever req comes in & we want passport to handle it & look at req header
  secretOrKey: configSec.secretKey
};

//Create Jwt Strategy to verify Token & access protected route
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  //Check if User ID in payload exists in our db
  //If it does call 'done' with that user else call 'done' without user
  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (user) {
      return done(null, user); //Calling 'done' with user
    } else {
      return done(null, false); //Calling 'done' without user
    }
  });
});

//Create local Strategy to verify emai/password
//By default it expects to have username so instead of username we are using email
const localLogin = new localStrategy(
  { usernameField: "email" },
  (email, password, done) => {
    //user le type gareko
    //Verify this email/password,call done with user if it's correct
    //Else call done with false
    User.findOne({ email }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      //Comparing password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false);
        }
        return done(null, user); //req.user
      });
      //console.log("login", user);
    });
  }
);

//Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);
