const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post.js');

//CORS setting
const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:5432'],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes of users and posts
app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);

//images handling
app.use('/image', express.static(path.join(__dirname, 'image')));

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
