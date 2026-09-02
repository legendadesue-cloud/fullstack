--
-- PostgreSQL database dump
--

\restrict CJ1Nd3zWx2KNv8ODD0xgACrt2TimMJlKiMpzwS9EWm4eKdPxK8GGH1DDSEEPe7K

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "FullName" character varying(150) CONSTRAINT profiles_full_name_not_null NOT NULL,
    "Email" character varying(255) CONSTRAINT profiles_email_not_null NOT NULL,
    password_hash character varying(255) NOT NULL,
    phone_number character varying(30) NOT NULL,
    date_of_birth date,
    location character varying(255),
    skills text,
    "Institution" character varying(255),
    qualification character varying(255),
    "FieldOfStudy" character varying(255),
    graduation_year integer,
    "VolunteerOrWorkExperience" text,
    "AreaOfInterest" text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, "FullName", "Email", password_hash, phone_number, date_of_birth, location, skills, "Institution", qualification, "FieldOfStudy", graduation_year, "VolunteerOrWorkExperience", "AreaOfInterest", created_at, updated_at) FROM stdin;
f8c6f46d-f168-4444-a845-e183faf2a873	Myom Adesue	legendadesue@gmail.com	$2b$10$UaVoV2w8QCutjjybrJd11.TtREn4KULnjLZ41TRtZ14fisdm4YKsi	08012345678	2000-12-13	Chad	none	university	bsc	software development	2020	none	none	2026-08-28 04:44:36.539525-07	2026-08-28 04:44:36.539525-07
\.


--
-- Name: profiles profiles_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE ("Email");


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict CJ1Nd3zWx2KNv8ODD0xgACrt2TimMJlKiMpzwS9EWm4eKdPxK8GGH1DDSEEPe7K

