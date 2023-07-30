const express = require("express");
const User = require("../models/User");
const Patterns = require("../models/Pattern");
const Classes = require("../models/Class");
const Smemesters = require("../models/Semester");
const Subjects = require("../models/Subject");
const Practicles = require("../models/Practicle");
const Post = require("../models/Posts");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
var success = false;

// GET PATTERNS USING GET "/API/FETCHPATTERNS"
router.get("/fetchPattern", fetchUser, async (req, res) => {
  try {
    const patterns = await Patterns.find();
    res.json(patterns);
  } catch (error) {
    return res.status(500).json({ success, error: "Some Error Occoured" });
  }
});

// GET ALL CLASS OF SELECETED PATTERN USING GET "/API/FETCHCLASS"
router.get("/fetchClass/:patternId", fetchUser, async (req, res) => {
  try {
    const classes = await Classes.find({ patten_id: req.params.patternId });
    res.json(classes);
  } catch (error) {
    res.status(500).send("Some Error Occoured");
  }
});

// GET ALL SEMESTERS OF SELECETED CLASS USING GET "/API/FETCHSEMESTERS"
router.get("/fetchSmesters/:classId", fetchUser, async (req, res) => {
  try {
    const semester = await Smemesters.find({ class_id: req.params.classId });
    res.json(semester);
  } catch (error) {
    res.status(500).send("Some Error Occoured");
  }
});

// GET ALL SUBJECTS OF SELECETED SEMESTER USING GET "/API/FETCHSUBJECTS"
router.get("/fetchSubjects/:semesterId", fetchUser, async (req, res) => {
  try {
    const subjects = await Subjects.find({
      semester_id: req.params.semesterId,
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).send("Some Error Occoured");
  }
});

// GET ALL PRACTICLES OF SELECETED SUBJECT USING GET "/API/FETCHPRACTICLES"
router.get("/fetchPracticles/:subjectId", fetchUser, async (req, res) => {
  try {
    const practicles = await Practicles.find({
      subject_id: req.params.subjectId,
    });
    res.json(practicles);
  } catch (error) {
    res.status(500).send("Some Error Occoured");
  }
});

// GET ALL NOTES OF LOGED IN USER OF SELECETED PRACTICLE USING GET "/API/FETCHPOSTS"
router.get("/fetchPost/:practicleId", fetchUser, async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          practicle_Id: mongoose.Types.ObjectId(req.params.practicleId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_Id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          link: 1,
          timestamp: 1,
          likes: 1,
          dislikes: 1,
          username: "$userDetails.name",
        },
      },
    ]);

    res.json(posts);
  } catch (error) {
    res.status(500).send("Some Error Occoured");
  }
});

// ADD POST IN POSTS USING GET "/API/ADDEPOST"
router.post(
  "/addPost",
  fetchUser,
  [body("link", "Invalid URL").isURL()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(406).json({ success, error: errors.array()[0].msg });
    }
    try {
      // FINDING IF LINK EXISTS
      let link = await Post.find({ practicle_Id: req.body.practicleId });
      for (const element of link) {
        if (element.link == req.body.link) {
          return res
            .status(500)
            .json({ success, error: "Link already exists" });
        }
      }
      const post = new Post({
        practicle_Id: req.body.practicleId,
        user_Id: req.user.id,
        link: req.body.link,
      });
      const savePost = await post.save();
      res.status(200).json(savePost);
    } catch (error) {
      res.status(500).send("Some Error Occoured");
    }
  }
);

// LIKE POST PUT "/API/LIKE"
router.put("/likePost/:postId", fetchUser, async (req, res) => {
  try {
    // REMOVE LIKE OF POST
    let like = await Post.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.postId),
          likes: mongoose.Types.ObjectId(req.user.id),
        },
      },
      { $project: { likes: 1 } },
    ]);
    if (like.length>0) {
      try {
        let post = await Post.findByIdAndUpdate(
          req.params.postId,
          {
            $pull: { likes: req.user.id },
          },
          {
            new: true,
          }
        );
        return res.json({ post });
      } catch (error) {
        console.log(error)
        return res.status(500).json({ success,  error: "Some error occoured" });
      }
    }

    // ADD LIKE TO POST
    let post = await Post.findById(req.params.postId);    
    if (post) {
      try {
        post = await Post.findByIdAndUpdate(
          req.params.postId,
          {
            $pull: { dislikes: req.user.id }, // Remove req.user.id from dislikes array
            $addToSet: { likes: req.user.id }, // Add req.user.id to likes array if not already present
          },
          {
            new: true,
          }
        );
        return res.json({ post });
      } catch (error) {
        return res.status(500).json({ success, error: "Some error occoured" });
      }
    }
  } catch (error) {
    res.status(500).json({ success, error: "Some Error Occoured" });
  }
});

// DISLIKE POST PUT "/API/DISLIKE"
router.put("/dislikePost/:postId", fetchUser, async (req, res) => {
  try {
     // REMOVE DISLIKE OF POST
     let dislike = await Post.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.postId),
          dislikes: mongoose.Types.ObjectId(req.user.id),
        },
      },
      { $project: { dislikes: 1 } },
    ]);
    if (dislike.length>0) {
      try {
        let post = await Post.findByIdAndUpdate(
          req.params.postId,
          {
            $pull: { dislikes: req.user.id },
          },
          {
            new: true,
          }
        );
        return res.json({ post });
      } catch (error) {
        console.log(error)
        return res.status(500).json({ success, error: "Some error occoured" });
      }
    }

    let post = await Post.findById(req.params.postId);    
    if (post) {
      try {
        post = await Post.findByIdAndUpdate(
          req.params.postId,
          {
            $pull: { likes: req.user.id }, // Remove req.user.id from dislikes array
            $addToSet: { dislikes: req.user.id }, // Add req.user.id to likes array if not already present
          },
          {
            new: true,
          }
        );
        return res.json({ post });
      } catch (error) {
        return res.status(500).json({ success, error: "Some error occoured" });
      }
    }
  } catch (error) {
    res.status(500).json({ success, error: "Some Error Occoured" });
  }
});

// UPDATE NOTE PUT "/API/UPDATE"
router.put(
  "/updatePost/:id",
  fetchUser,
  [body("link", "Invalid URL").isURL()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(406).json({ success, error: errors.array()[0].msg });
    }
    try {
      const link = req.body.link;
      // CREATE NEW NOTES OBJECT
      const newPost = {};
      if (link) {
        newPost.link = link;
      }
      newPost.timestamp = new Date(Date.now()).toISOString();

      // FINDING NOTE TO BE UPDATED
      let post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(500).json({ success, error: "Post Not Found" });
      }

      if (post.user_Id.toString() != req.user.id) {
        return res.status(401).json({ success, error: "Not Allowed" });
      }
      post = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: newPost },
        { new: true }
      );
      res.json({ post });
    } catch (error) {
      res.status(500).json({ success, error: "Some Error Occoured" });
    }
  }
);

// DELETE NOTE DELETE "/API/DELETE"
router.delete("/deletePost/:id", fetchUser, async (req, res) => {
  try {
    // FINDING NOTE TO BE DELETED
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(500).json({ success, error: "Not Found" });
    }

    // CHECK OWNER OF POST
    if (post.user_Id.toString() != req.user.id) {
      return res.status(401).json({ success, error: "Not Allowed" });
    }

    post = await Post.findByIdAndDelete(req.params.id);
    res.json({ Sucess: "Post is Deleted", post: post });
  } catch (error) {
    res.status(500).send("Some Error Occoured");
  }
});

module.exports = router;
