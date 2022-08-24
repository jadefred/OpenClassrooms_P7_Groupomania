const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');
const authRoutes = require('./src/routes/auth');
const postRoutes = require('./src/routes/post.js');
const commentRoutes = require('./src/routes/comment.js');
const userRoutes = require('./src/routes/user');
const cookieParser = require('cookie-parser');

//CORS setting
const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:5432'],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/user', userRoutes);

//images handling
app.use('/image', express.static(path.join(__dirname, 'image')));

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
