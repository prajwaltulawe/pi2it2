const mongoose = require('mongoose');
const {Schema} = mongoose;
const SemesterSchema = new Schema({
    pattern_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "pattern"
    },
    class_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "class"
    },
    semester: {
        type: Number,
        required: true
    },
});
const Semester = mongoose.model("sem", SemesterSchema);
module.exports = Semester;