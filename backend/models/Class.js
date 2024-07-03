const mongoose = require('mongoose');
const {Schema} = mongoose;
const ClassSchema = new Schema({
    pattern_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "pattern"
    },
    class: {
        type: String,
        required: true
    },
    classDescription: {
        type: String,
        required: true
    },
});
const Class = mongoose.model("class", ClassSchema);
module.exports = Class;