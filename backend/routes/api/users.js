const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const jwt = require("jwt-simple");

//Model
const User = require("../../models/User");

const passport = require("passport");
const passportService = require("../../services/passport");

//Auth middleware for login
const requireLogin = passport.authenticate("local", { session: false });

//Generating jwtoken => identifying piece of info created including user id & iat
const tokenForUser = user => {
  const timestamp = new Date().getTime();
  //payload
  return jwt.encode({ sub: user.id, iat: timestamp }, keys.secretKey);
};

// => /api/users
router.get("/", (req, res) => {
  res.send("Users");
});

// => /api/users/register
router.post(
  "/register",
  [
    //Validating
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include valid email").isEmail(),
    check("password", "Password must be at lease 5 char long").isLength({
      min: 5
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //array method
    }
    //User input
    const { name, email, password } = req.body;
    //Check to see if email already exists
    User.findOne({ email }).then(userEmail => {
      if (userEmail) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already exists" }] }); //formatted as express-validator error
      }
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({ name, email, password, avatar });
      //Hashing Password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          //if (err) throw err;
          newUser.password = hash;

          newUser
            .save()
            .then(user => {
              res.json({ token: tokenForUser(user) });
            })
            .catch(err => {
              res.json(err);
            });
        });
      }); //bcrypt
    }); //findOne
  } //req,res
); //post method

// => /api/users/login
router.post(
  "/login",

  requireLogin,
  (req, res) => {
    res.send({ token: tokenForUser(req.user) });
  }
);

module.exports = router;
