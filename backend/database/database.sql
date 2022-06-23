-- Add uuid extension to generate random primary key for id
SELECT * FROM pg_available_extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE groupomania;

-- Table for all user data
CREATE TABLE users(
  user_id UUID PRIMARY KEY NOT NULL UNIQUE,
  username VARCHAR(30) NOT NULL,
  avatar_url VARCHAR(255),
  email VARCHAR(50) NOT NULL UNIQUE,
  pw_hashed CHAR(60) NOT NULL,
  admin BOOLEAN NOT NULL DEFAULT FALSE, 
  refresh_token VARCHAR(255)
);

DELETE FROM users
WHERE user_id=2;