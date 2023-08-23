const mongoose = require('mongoose');
require('dotenv').config();
const connectionURI = process.env.CONNNECTION_URI || "mongodb://localhost:27017/pi2it2";
mongoose.connect(connectionURI, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  });

const connectToMongo = () =>{
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("established");
    });
}

module.exports = connectToMongo;