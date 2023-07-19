const express = require("express");
const Post = require("../models/Posts");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const fetchUser = require("../middleware/fetchUser");

// GET ALL NOTES OF LOGED IN USER OF SELECETED PRACTICLE USING GET "/API/FETCHPOSTS"
router.get("/fetchPost", 
fetchUser, 
async (req, res) => {
  try {        
      const posts = await Post.find({ practicle_Id: req.body.practicleId });
      res.json(posts);
  } catch (error) {
      res.status(500).send("Some Error Occoured");
  }
});

// ADD POST IN POSTS USING GET "/API/ADDEPOST"
router.post("/addPost", 
fetchUser,
  async (req, res) => {
    try {
      const post = new Post({
        practicle_Id: req.body.practicleId,
        user_Id: req.user.id,
        link: req.body.link
      });
      const savePost = await post.save();
      res.json(savePost);
    } catch (error) {
        res.status(500).send("Some Error Occoured");
    }
  }
);

// UPDATE NOTE PUT "/API/UPDATE"
router.put("/updatePost/:id", fetchUser, async (req, res) => {
    try {
      const link = req.body.link;

      // CREATE NEW NOTES OBJECT
      const newPost = {};
      if(link) {newPost.link = link}

      // FINDING NOTE TO BE UPDATED
      let post = await Post.findById(req.params.id);
      if (!post) { return res.status(500).send("Not Found");   }
    
      if(post.user_Id.toString() != req.user.id){
        return res.status(401).send("Not Allowed")
      }

      post = await Post.findByIdAndUpdate(req.params.id, {$set: newPost}, {new: true});
      res.json({post});

    } catch (error) {
        res.status(500).send("Some Error Occoured");
    }
  }
);

// DELETE NOTE DELETE "/API/DELETE"
router.delete("/deletePost/:id", fetchUser, async (req, res) => {
  try {
    // FINDING NOTE TO BE DELETED
    let post = await Post.findById(req.params.id);
    if (!post) { return res.status(500).send("Not Found");   }

    // CHECK OWNER OF POST
    if(post.user_Id.toString() != req.user.id){
      return res.status(401).send("Not Allowed")
    }

    post = await Post.findByIdAndDelete(req.params.id);
    res.json({"Sucess": "Post is Deleted", post: post});

  } catch (error) {
      res.status(500).send("Some Error Occoured");
  }
}
);

module.exports = router;