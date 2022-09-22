import express from 'express';
const app = express();
const port = 3000;
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import postRoutes from './routes/post';
import commentRoutes from './routes/comment';
import userRoutes from './routes/user';
import cookieParser from 'cookie-parser';

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
