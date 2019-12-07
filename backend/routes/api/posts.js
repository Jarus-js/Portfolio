const router = require("express").Router();
const passport = require("passport");
const passportService = require("../../services/passport");
const { check, validationResult } = require("express-validator");
const config = require("../../config/keys");
//Model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

const requireAuth = passport.authenticate("jwt", { session: false });

// => /api/posts/add
router.post(
  "/add",
  requireAuth,
  [check("post", "Post is required")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //array method
    }

    User.findById(req.user.id)
      .then(user => {
        const newPost = new Post({
          user: req.user.id,
          post: req.body.post,
          name: user.name,
          avatar: user.avatar
        });
        //save
        return newPost.save().then(post => res.json(post));
      })
      .catch(err => res.json(err));
  }
);

//GET => /api/posts/all
router.get("/all", requireAuth, (req, res) => {
  Post.find({})
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.json(err));
});

//GET => /api/posts/:postId
router.get("/:postId", requireAuth, (req, res) => {
  Post.findById(req.params.postId)
    .then(post => {
      if (!post) {
        return res.status(404).json({ msg: "post not found" });
      }
      res.json(post);
    })
    .catch(err => res.json(err));
});

//DELETE => /api/posts/delete/:postId
router.delete("/delete/:postId", requireAuth, (req, res) => {
  Post.findById(req.params.postId)
    .then(post => {
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }
      return post.remove().then(() => res.json({ msg: "Post removed" }));
    })
    .catch(err => res.json(err));
});

//PUT => /api/posts/like/:id
router.put("/like/:id", requireAuth, (req, res) => {
  Post.findById(req.params.id).then(post => {
    //Check to see if post has already been liked & likes.user ma login user xa vane pani already
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    post.save().then(() => res.json(post.likes));
  });
});

//PUT => /api/posts/unlike/:id
router.put("/unlike/:id", requireAuth, (req, res) => {
  Post.findById(req.params.id).then(post => {
    //Check to see if post has already been liked & likes.user ma login user xa vane pani already
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not been liked yet" });
    }
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    post.save().then(() => res.json(post.likes));
  });
});

// => /api/posts/addComment/:postId
router.post(
  "/addComment/:postId",
  requireAuth,
  [check("text", "Text is required")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //array method
    }
    User.findById(req.user.id)
      .then(user => {
        console.log("Manxe", user);
        const newComment = {
          user: req.user.id,
          text: req.body.text,
          name: user.name,
          avatar: user.avatar
        };
        Post.findById(req.params.postId).then(post => {
          console.log("Posty", post);
          post.comments.unshift(newComment);
          //save
          post.save().then(post => {
            console.log("Post wala", post);
            return res.json(post.comments);
          });
        });
      })
      .catch(err => res.json(err));
  }
);

// => /api/posts/comment/:postId/:commentId
router.post("/comment/:postId/:commentId",requireAuth, (req, res) => {
  Post.findById(req.params.postId).then(post => {
    //Check if user passed comment exist in db comments
    const comment = post.comments.find(
      comment => req.params.commentId === comment.id
    );

    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment doesnot exists" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Comment dont belong to you" });
    }

    //Get remove index
    const removeIndex = post.comments
      .map(comment => {
        comment.user.toString();
      })
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    post.save().then(post => res.json(post.comments));
  });
});

module.exports = router;
