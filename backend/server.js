const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const userRoutes = require('./routes/user');

//CORS setting
const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:5432'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//app.use(cors(corsOptions));
app.use(express.json());

//routes of users and posts
app.use('/api/auth', userRoutes);

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
