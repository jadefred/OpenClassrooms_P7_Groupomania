--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    comment_id uuid NOT NULL,
    user_id uuid NOT NULL,
    post_id uuid NOT NULL,
    commentbody character varying(255),
    imageurl character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    title character varying(100) NOT NULL,
    content character varying(255),
    imageurl character varying(100),
    likes integer DEFAULT 0,
    likeuserid text[] DEFAULT ARRAY[]::text[],
    totalcomment integer DEFAULT 0,
    commentid text[] DEFAULT ARRAY[]::text[],
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT posts_likes_check CHECK ((likes >= 0)),
    CONSTRAINT posts_totalcomment_check CHECK ((totalcomment >= 0))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id uuid NOT NULL,
    username character varying(30) NOT NULL,
    avatar_url character varying(255),
    email character varying(255) NOT NULL,
    pw_hashed character(60) NOT NULL,
    admin boolean DEFAULT false NOT NULL,
    refresh_token character varying(255)
);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (comment_id, user_id, post_id, commentbody, imageurl, created_at) FROM stdin;
e5686ea7-5742-4b2b-ab60-fff171032ce2	fbfd8610-7834-4927-9879-3567aaf80433	64da40e7-6394-4df0-ac8e-8398df77c8f0	Il est mignon	\N	2022-08-25 21:22:19.591629+02
bfcd924c-495b-4923-aad7-58cdcfed399c	12924fda-493a-40d8-94e5-abb656d9da40	196666e8-6f44-4bf1-aae7-85e17479d1cd	Salut tout le monde	\N	2022-08-25 21:27:17.470717+02
a2d0d6da-237f-49b0-9c06-162ddd65243f	12924fda-493a-40d8-94e5-abb656d9da40	64da40e7-6394-4df0-ac8e-8398df77c8f0	mdr	\N	2022-08-25 21:27:25.917791+02
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts (post_id, user_id, title, content, imageurl, likes, likeuserid, totalcomment, commentid, created_at) FROM stdin;
196666e8-6f44-4bf1-aae7-85e17479d1cd	fbfd8610-7834-4927-9879-3567aaf80433	Bienvenue		http://localhost:3000/image/1661454948139.spongebob.jpeg	2	{afc43ca2-ae0e-42c0-a8ee-c48d531c2e3b,12924fda-493a-40d8-94e5-abb656d9da40}	1	{bfcd924c-495b-4923-aad7-58cdcfed399c}	2022-08-25 21:15:06.744905+02
64da40e7-6394-4df0-ac8e-8398df77c8f0	afc43ca2-ae0e-42c0-a8ee-c48d531c2e3b	Mon nouvel assistant	Il fait moins de fautes d'orthographe que moi !	http://localhost:3000/image/1661455244739.dog_work.jpeg	2	{12924fda-493a-40d8-94e5-abb656d9da40,fbfd8610-7834-4927-9879-3567aaf80433}	2	{8f324ea8-be6f-4fee-85bc-db8f86cb66fc,e5686ea7-5742-4b2b-ab60-fff171032ce2,a2d0d6da-237f-49b0-9c06-162ddd65243f,990465fd-ec0c-4ed3-a842-3f1c8303183e,6986d30f-e405-48d8-ac70-1d84150e5c40,5d9e8e90-38f9-45b3-b5fd-c4da8abcce5f}	2022-08-25 21:20:44.748714+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, username, avatar_url, email, pw_hashed, admin, refresh_token) FROM stdin;
afc43ca2-ae0e-42c0-a8ee-c48d531c2e3b	Camille	http://localhost:3000/image/1663940263251.profile.jpeg	email@email.com	$2b$10$doufnGkOdQdTXBG1tqEq/.PbiIpJSsb5N0DMpisoLUmUsiTBUtN8O	f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZmM0M2NhMi1hZTBlLTQyYzAtYThlZS1jNDhkNTMxYzJlM2IiLCJpYXQiOjE2NjM5NDAxMDYsImV4cCI6MTY5NTQ3NjEwNn0.d459GE_hzx3mxC9PCJAuOYu2vL3ozXXfw4jMXvaBi6Q
fbfd8610-7834-4927-9879-3567aaf80433	Admin	http://localhost:3000/image/1661260920629.download.png	test@email.com	$2b$10$jqp6nIabeqLFmZH5UcpAKOznS8NXgBMvgG4koU9hJlapz8ZNhu1jK	t	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYmZkODYxMC03ODM0LTQ5MjctOTg3OS0zNTY3YWFmODA0MzMiLCJpYXQiOjE2NjQwMjM1MTMsImV4cCI6MTY5NTU1OTUxM30.7g5BwvV7BesgNmo2yvs7RgjSX8cX5BIhAjPx0fMzKNY
60ae25cc-6774-46bf-b771-ad5e1d4279aa	user1	\N	newtest@test.com	$2b$10$HJCJV6Kk648RcdzGA2vir.z9fUxc2AZZZS.e5h2fvdRfFi1Fc1AAi	f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGFlMjVjYy02Nzc0LTQ2YmYtYjc3MS1hZDVlMWQ0Mjc5YWEiLCJpYXQiOjE2NTU5OTAyODR9.9p7cVXIR9KTIMI2CWtLcIX_gaYwWiZ8bhBjc5FLr5Ug
9dee48fc-e31b-469d-bfaa-394439902acf	user2	\N	newtest2@test.com	$2b$10$WeXgsUz9q9LEa32NCAVUjeEoBuG31UNo3tXaoV/U8ZFn0eqq1qYoq	f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZGVlNDhmYy1lMzFiLTQ2OWQtYmZhYS0zOTQ0Mzk5MDJhY2YiLCJpYXQiOjE2NTU5OTAzNjd9.49LjjRpn2dNjhbVbzTKpJNMhsHpxbOJqnktwwTL6mBs
12924fda-493a-40d8-94e5-abb656d9da40	Lucas	http://localhost:3000/image/1661455589969.wp10178937.jpeg	test@test.com	$2b$10$uvCufTNakSKvSmJrZ8tb0.415zcAJM441E3Loj5zrDervJm9HGuie	f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjkyNGZkYS00OTNhLTQwZDgtOTRlNS1hYmI2NTZkOWRhNDAiLCJpYXQiOjE2NjE0NTg5NjEsImV4cCI6MTY5Mjk5NDk2MX0.wAs3QOfGwAZI6pblHX8_7qW009ckgIyVYPyMbyIcKOc
\.


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (post_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(post_id);


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

