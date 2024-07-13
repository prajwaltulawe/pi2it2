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

/*
import { createClient } from 'redis';
const client = createClient({
    password: 'pPE9GYOO08LNjG2ltDM1noCkpPv7LupZ',
    socket: {
        host: 'redis-10763.c14.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 10763
    }
});
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
*/