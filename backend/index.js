const {connectToMongo} = require('./db');
connectToMongo();

const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
app.use(express.json())
app.use(cors())

// AVAILABLE ROUTES
app.use('/api/auth',require('./routes/auth'));
app.use('/api/admin',require('./routes/admin')); 
app.use('/api/posts',require('./routes/posts')); 
app.get('/', (req, res) => {
  res.send('Helloorld!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})