const mongoose = require('mongoose');
const {Schema} = mongoose;
const PatternSchema = new Schema({
    year: {
        type: Number,
        required: true
    },
});
const Pattern = mongoose.model("pattern", PatternSchema);
module.exports = Pattern;