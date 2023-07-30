const mongoose = require('mongoose');
const {Schema} = mongoose;
const PostsSchema = new Schema({
    practicle_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "practicle"
    },
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    link: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    timestamp:{
        type: Date,
        default: Date.now
    }
});
const Posts = mongoose.model("posts", PostsSchema);
module.exports = Posts;