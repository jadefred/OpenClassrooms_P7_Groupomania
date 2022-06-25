-- Add uuid extension to generate random primary key for id
SELECT * FROM pg_available_extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE groupomania;

-- Table for all users data
CREATE TABLE users(
  user_id UUID PRIMARY KEY NOT NULL UNIQUE,
  username VARCHAR(30) NOT NULL,
  avatar_url VARCHAR(100),
  email VARCHAR(50) NOT NULL UNIQUE,
  pw_hashed CHAR(60) NOT NULL,
  admin BOOLEAN NOT NULL DEFAULT FALSE, 
  refresh_token VARCHAR(255)
);


-- Table for posts
CREATE TABLE posts(
  post_id UUID PRIMARY KEY NOT NULL UNIQUE,
  user_id UUID REFERENCES users(user_id) NOT NULL,
  title VARCHAR(100) NOT NULL,
  content VARCHAR(255),
  imageUrl VARCHAR(100),
  likes INT DEFAULT 0 CHECK (likes >= 0),
  likeUserId TEXT [] DEFAULT array[]::TEXT[],
  totalComment INT DEFAULT 0,
  commentId TEXT [],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for comments
CREATE TABLE comments(
  comment_id UUID PRIMARY KEY NOT NULL UNIQUE,
  user_id UUID REFERENCES users(user_id) NOT NULL,
  commentBody VARCHAR(255),
  imageUrl VARCHAR(100)
);

INSERT INTO posts (post_id, user_id, title, content) VALUES (uuid_generate_v4(), 'fbfd8610-7834-4927-9879-3567aaf80433', 'test JOIN', 'JOIN content');
INSERT INTO posts (post_id, user_id, title, imageUrl) VALUES (uuid_generate_v4(), 'afc43ca2-ae0e-42c0-a8ee-c48d531c2e3b', 'test image', 'http://localhost:3000/1656017763164.7fa7c83d9fa9c44cb774a08b0b596219.jpeg');

-- To insert data
INSERT INTO posts (post_id, title, likeUserId) VALUES (uuid_generate_v4(), 'second title', ARRAY ['dc85baa4-ff25-4776-a472-fc25da5c7a25']);

-- to update array 
UPDATE posts SET likeUserId = array_append(likeUserId, $1), likes = (likes + $2) WHERE post_id = $3;

DELETE FROM posts WHERE post_id = '6321de8a-ff4b-4cf4-a70c-5626338a3396';

-- array query, if array contains certain value
SELECT post_id FROM posts WHERE 'fbfd8610-7834-4927-9879-3567aaf80433' = ANY(likeUserId);

-- JOIN two table
SELECT (posts).*, users.username, users.avatar_url FROM posts JOIN users ON posts.user_id = users.user_id ORDER BY posts.created_at ASC;

SELECT (posts).*, users.username, users.avatar_url FROM posts JOIN users ON posts.user_id = users.user_id WHERE posts.post_id = 'c7d02a9d-c490-4e63-bed5-4fd59a8574bd';




