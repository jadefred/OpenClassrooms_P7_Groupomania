const express = require('express');
const app = express();
const cors = require('cors');
//const pool = require('./database/database.js');
const userRoutes = require('./routes/user');

app.use(cors());
app.use(express.json());

//routes of users and posts
app.use('/api/auth', userRoutes);

app.listen(8080, () => {
  console.log('Server has started on port 8080');
});
