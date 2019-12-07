const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const request = require('request');
const config = require('../../config/keys');
//Model
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const passport = require("passport");
const passportService = require("../../services/passport");

const requireAuth = passport.authenticate("jwt", { session: false });

// => /api/profile/add
router.post(
  "/add",
  requireAuth,
  [
    //Validating
    check("status", "Status is required")
      .not()
      .isEmpty(),
    check("skills", "Skills is required")
      .not()
      .isEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //array method
    }
    //User input
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      facebook,
      instagram
    } = req.body;
    //Check to see if user already has profile
    Profile.findOne({ user: req.user.id }).then(userProfile => {
      if (!userProfile) {
        const newProfile = new Profile({
          user: req.user.id,
          company,
          website,
          location,
          bio,
          status,
          githubusername,
          skills,
          facebook,
          instagram
        });
        newProfile
          .save()
          .then(profile => {
            res.json(profile);
          })
          .catch(err => {
            res.json(err);
          });
      } else {
        res.json("Profile already made");
      }
    });
  }
);

// => /api/profile/update
router.post("/update", requireAuth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(updatedProfile => {
      updatedProfile.company = req.body.company;
      updatedProfile.website = req.body.website;
      updatedProfile.location = req.body.location;
      updatedProfile.bio = req.body.bio;
      updatedProfile.status = req.body.status;
      updatedProfile.githubusername = req.body.githubusername;
      updatedProfile.skills = req.body.skills;
      updatedProfile.facebook = req.body.facebook;
      updatedProfile.instagram = req.body.instagram;

      //save
      updatedProfile
        .save()
        .then(newProfile => {
          res.json(newProfile);
        })
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

//GET all profile
// => /api/profile/all
router.get("/all", (req, res) => {
  Profile.find({})
    .populate("user", ["name", "email", "avatar"])
    .then(profiles => res.json(profiles))
    .catch(err => res.json(err));
});

//GET profiles by userId
// => /api/profile/user/:id
router.get("/user/:id", (req, res) => {
  Profile.findOne({ user: req.params.id })
    //.populate("user", ["name", "email", "avatar"])
    .then(profile => res.json(profile))
    .catch(err => res.json(err));
});

//=> /api/profile/delete
router.post("/delete", requireAuth, (req, res) => {
  //Remove Profile
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => res.json("Removed"))
    .catch(err => res.json(err));
  User.findOneAndRemove({ _id: req.user.id })
    .then(() => res.json("Removed"))
    .catch(err => res.json(err));
});

//ADD EXPERIENCE
// => /api/profile/addExperience
router.post(
  "/addExperience",
  requireAuth,
  [
    //Validating
    check("title", "Title is required")
      .not()
      .isEmpty(),
    check("company", "Company is required")
      .not()
      .isEmpty(),
    check("from", "From Date is required")
      .not()
      .isEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //array method
    }
    //User input
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    //Check to see if user already has profile
    Profile.findOne({ user: req.user.id }).then(userProfile => {
      if (userProfile) {
        const newExperience = {
          title,
          company,
          location,
          from,
          to,
          current,
          description
        };
        userProfile.experience.unshift(newExperience);
        userProfile
          .save()
          .then(profile => {
            res.json(profile);
          })
          .catch(err => {
            res.json(err);
          });
      } else {
        res.json("No Profile Match");
      }
    });
  }
);

//=> /api/profile/experience/delete/:id
router.post("/experience/delete/:id", requireAuth, (req, res) => {
  //Remove Profile
  Profile.findOne({ user: req.user.id })
    .then(profile => { 
      const removeIndex = profile.experience .map(exp => exp.id)
        .indexOf(req.params.id);
      profile.experience.splice(removeIndex, 1);
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.json(err));
});

//GET user repos from github
// => /api/profile/github/:username
router.get('/github/:username',(req,res)=>{
  const options = {
    uri: encodeURI(`https://api.github.com/users/${
      req.params.username
    }/repos?per_page=5&sort=created:asc&client_id=${config.githubClientId}&client_secret=${config.githubSecret}`),
    method: 'GET',
    headers: { 'user-agent': 'node.js' }
  };
  request(options, (error, response, body) => {
    if (error) console.error(error);

    if (response.statusCode !== 200) {
      return res.status(404).json({ msg: 'No Github profile found' });
    }

    res.json(JSON.parse(body));
  });

})

module.exports = router;
