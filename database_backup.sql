--
-- PostgreSQL database dump
--

\restrict iY2D5KudDWgbsF8hfxjBjgwVaRhT8TYU7sfd4AOeCI85ZOR2EA2YIu0zVKvB35m

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
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: event_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_registrations (
    id integer NOT NULL,
    event_id integer NOT NULL,
    volunteer_id uuid NOT NULL,
    registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.event_registrations OWNER TO postgres;

--
-- Name: event_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_registrations_id_seq OWNER TO postgres;

--
-- Name: event_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_registrations_id_seq OWNED BY public.event_registrations.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    organization character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    event_date date NOT NULL,
    location character varying(255) NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    capacity integer NOT NULL,
    volunteers integer DEFAULT 0,
    registration_deadline date,
    description text,
    image_url text,
    status character varying(50) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: event_registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations ALTER COLUMN id SET DEFAULT nextval('public.event_registrations_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_registrations (id, event_id, volunteer_id, registered_at) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, name, organization, category, event_date, location, start_time, end_time, capacity, volunteers, registration_deadline, description, image_url, status, created_at) FROM stdin;
1	care	care	Community	2026-12-13	lagos	00:00:00	23:00:00	12	1	2026-11-30	healthcare	https://res.cloudinary.com/kuooy7jc/image/upload/v1788861545/armslength/events/zqo7jhp6t1mglqhbdbmv.jpg	Approved	2026-09-08 02:59:12.68109
4	o	kjhgfd	Community	2026-09-11	kaduna	07:01:00	19:02:00	11	1	2026-09-30	xsdfghjkldfghjk	https://res.cloudinary.com/kuooy7jc/image/upload/v1789197941/armslength/events/iu1dku6z3w9lenfhzij8.jpg	Approved	2026-09-12 00:25:51.652456
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, "FullName", "Email", password_hash, phone_number, date_of_birth, location, skills, "Institution", qualification, "FieldOfStudy", graduation_year, "VolunteerOrWorkExperience", "AreaOfInterest", created_at, updated_at) FROM stdin;
f8c6f46d-f168-4444-a845-e183faf2a873	Myom Adesue	legendadesue@gmail.com	$2b$10$UaVoV2w8QCutjjybrJd11.TtREn4KULnjLZ41TRtZ14fisdm4YKsi	08012345678	2000-12-13	Chad	none	university	bsc	software development	2020	none	none	2026-08-28 04:44:36.539525-07	2026-08-28 04:44:36.539525-07
a4b42232-e7cb-4771-a113-c4a9aada8951	Abraham Uduak Japhet	betheladesue@gmail.com	$2b$10$DNmB5AD8AnTxOWtx0mwn8..4Q.i0cg628vjBg7IiD39bF5VzfnFiy	0908767784	1984-12-13	CARE	none	university	bsc	software development	1994	none	none	2026-09-10 04:09:51.11521-07	2026-09-10 04:09:51.11521-07
143df0f5-b21e-42fb-808d-3dd70567620a	matthew ahme	simmsmarks082@gmail.com	$2b$10$g3G5IRCC0Z/K3ORBySW9Wuy66c5OH338MiuxGlb.LmBhE9D2nGjl2	080456798	1998-05-16	lagos	none	school	bsc	software	2023	none	null	2026-09-16 01:55:05.580486-07	2026-09-16 01:55:05.580486-07
\.


--
-- Name: event_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_registrations_id_seq', 1, false);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 4, true);


--
-- Name: event_registrations event_registrations_event_id_volunteer_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_event_id_volunteer_id_key UNIQUE (event_id, volunteer_id);


--
-- Name: event_registrations event_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE ("Email");


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: event_registrations event_registrations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_registrations event_registrations_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict iY2D5KudDWgbsF8hfxjBjgwVaRhT8TYU7sfd4AOeCI85ZOR2EA2YIu0zVKvB35m

