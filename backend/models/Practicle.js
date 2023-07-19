const mongoose = require('mongoose');
const {Schema} = mongoose;
const PracticleSchema = new Schema({
    pattern_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "pattern"
    },
    class_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "class"
    },
    sem_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "sem"
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subject"
    },
    practicle: {
        type: String,
        required: true
    },
});
const Practicle = mongoose.model("practicle", PracticleSchema);
module.exports = Practicle;