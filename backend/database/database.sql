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
  totalComment INT DEFAULT 0 CHECK (totalComment >= 0),
  commentId TEXT [] DEFAULT array[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for comments
CREATE TABLE comments(
  comment_id UUID PRIMARY KEY NOT NULL UNIQUE,
  user_id UUID REFERENCES users(user_id) NOT NULL,
  post_id UUID REFERENCES posts(post_id) NOT NULL,
  commentBody VARCHAR(255),
  imageUrl VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (post_id, user_id, title, content) VALUES (uuid_generate_v4(), 'fbfd8610-7834-4927-9879-3567aaf80433', 'test JOIN', 'JOIN content');
INSERT INTO posts (post_id, user_id, title, imageUrl) VALUES (uuid_generate_v4(), 'afc43ca2-ae0e-42c0-a8ee-c48d531c2e3b', 'test image', 'http://localhost:3000/1656017763164.7fa7c83d9fa9c44cb774a08b0b596219.jpeg');

-- To insert data
INSERT INTO posts (post_id, title, likeUserId) VALUES (uuid_generate_v4(), 'second title', ARRAY ['dc85baa4-ff25-4776-a472-fc25da5c7a25']);

-- to update array 
UPDATE posts SET likeUserId = array_append(likeUserId, $1), likes = (likes + $2) WHERE post_id = $3;

DELETE FROM posts WHERE post_id = 'c8951a24-b9c8-4e4c-bba6-bacaf5830e7f';
DELETE FROM comments WHERE comment_id = '3bd5e767-1564-4c75-8e7f-df7039cb84bf';

SELECT commentId FROM posts;

DELETE FROM comments WHERE comment_id = ANY(ARRAY [$1]) RETURNING *;




-- array query, if array contains certain value
SELECT post_id FROM posts WHERE 'fbfd8610-7834-4927-9879-3567aaf80433' = ANY(likeUserId);

-- JOIN two table
SELECT (posts).*, users.username, users.avatar_url FROM posts JOIN users ON posts.user_id = users.user_id ORDER BY posts.created_at ASC;


UPDATE posts SET title = 'hahahaha', content = 'change me too', imageUrl = 'http://localhost:3000/image/1656254401490.7fa7c83d9fa9c44cb774a08b0b596219.jpeg' WHERE post_id = '72c3bf26-12bf-43d8-b483-cedad89a497f' AND user_id = 'fbfd8610-7834-4927-9879-3567aaf80433';