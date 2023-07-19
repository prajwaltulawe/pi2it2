const mongoose = require('mongoose');
const {Schema} = mongoose;
const SubjectSchema = new Schema({
    pattern_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "pattern"
    },
    class_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "class"
    },
    semester_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "sem"
    },
    subject: {
        type: String,
        required: true
    },
});
const Subject = mongoose.model("subject", SubjectSchema);
module.exports = Subject;