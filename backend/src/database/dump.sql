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
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    comment_id uuid NOT NULL,
    user_id uuid NOT NULL,
    post_id uuid NOT NULL,
    commentbody character varying(255),
    imageurl character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (comment_id, user_id, post_id, commentbody, imageurl, created_at) FROM stdin;
cb7b0cd4-5faf-44ec-92eb-54fa5ce478da	12924fda-493a-40d8-94e5-abb656d9da40	7bb45e1f-495b-449f-a195-2fc8b527234a	Salut tout le monde !	\N	2022-10-12 14:07:25.768992+02
caebccb8-b63f-4028-8db9-928258b85c3d	12924fda-493a-40d8-94e5-abb656d9da40	a0b8aa26-9f48-4bc6-a068-f05b5870e254	mdr	\N	2022-10-12 14:08:04.16729+02
5d269e09-84d3-4a4b-91c5-96dacd17154b	fbfd8610-7834-4927-9879-3567aaf80433	a0b8aa26-9f48-4bc6-a068-f05b5870e254	Il est mignon	\N	2022-10-12 14:08:21.66977+02
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (post_id, user_id, title, content, imageurl, likes, likeuserid, totalcomment, commentid, created_at) FROM stdin;
a0b8aa26-9f48-4bc6-a068-f05b5870e254	afc43ca2-ae0e-42c0-a8ee-c48d531c2e3b	Mon nouveau assistant	Il fait moins de fautes d'orthographe que moi	http://localhost:3000/image/1665576469346.dog_work.jpeg	2	{12924fda-493a-40d8-94e5-abb656d9da40,fbfd8610-7834-4927-9879-3567aaf80433}	2	{caebccb8-b63f-4028-8db9-928258b85c3d,5d269e09-84d3-4a4b-91c5-96dacd17154b}	2022-10-12 14:07:49.727618+02
7bb45e1f-495b-449f-a195-2fc8b527234a	fbfd8610-7834-4927-9879-3567aaf80433	Bienvenue		http://localhost:3000/image/1665576428934.spongebob.jpeg	2	{12924fda-493a-40d8-94e5-abb656d9da40,afc43ca2-ae0e-42c0-a8ee-c48d531c2e3b}	1	{cb7b0cd4-5faf-44ec-92eb-54fa5ce478da}	2022-10-12 14:07:09.304078+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, avatar_url, email, pw_hashed, admin, refresh_token) FROM stdin;
afc43ca2-ae0e-42c0-a8ee-c48d531c2e3b	Camille	http://localhost:3000/image/1663940263251.profile.jpeg	email@email.com	$2b$10$doufnGkOdQdTXBG1tqEq/.PbiIpJSsb5N0DMpisoLUmUsiTBUtN8O	f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZmM0M2NhMi1hZTBlLTQyYzAtYThlZS1jNDhkNTMxYzJlM2IiLCJpYXQiOjE2NjU1NzY0NTIsImV4cCI6MTY5NzExMjQ1Mn0.ImXSm2JQFVHAi_Ec17XYutV4kud4oCgGnQdJrQ3p-Wg
12924fda-493a-40d8-94e5-abb656d9da40	Tom	http://localhost:3000/image/1661455589969.wp10178937.jpeg	test@test.com	$2b$10$uvCufTNakSKvSmJrZ8tb0.415zcAJM441E3Loj5zrDervJm9HGuie	f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjkyNGZkYS00OTNhLTQwZDgtOTRlNS1hYmI2NTZkOWRhNDAiLCJpYXQiOjE2NjU1NzY0NzksImV4cCI6MTY5NzExMjQ3OX0.F8H2Xbkmya7p-yg_u35KaKcKu8qXfq62DROsP-0dgdc
fbfd8610-7834-4927-9879-3567aaf80433	Admin	http://localhost:3000/image/1661260920629.download.png	test@email.com	$2b$10$jqp6nIabeqLFmZH5UcpAKOznS8NXgBMvgG4koU9hJlapz8ZNhu1jK	t	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYmZkODYxMC03ODM0LTQ5MjctOTg3OS0zNTY3YWFmODA0MzMiLCJpYXQiOjE2NjU1NzY0OTUsImV4cCI6MTY5NzExMjQ5NX0.V6b_prl1SIbBXjZLsPv3vf23MGPOWpJmnXMSejXgeWc
\.


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (post_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(post_id);


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

