--
-- PostgreSQL database dump
--

\restrict 0WDyhDMVhBIjqWd8VXl3EbUHSUQqcHE3h8CYIjnLJlxbbdNWKQsI5JPhyPqO4Qh

-- Dumped from database version 18.3 (Homebrew)
-- Dumped by pg_dump version 18.3 (Homebrew)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: mac
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO mac;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: mac
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Brand; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE public."Brand" (
    id integer NOT NULL,
    name text NOT NULL,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Brand" OWNER TO mac;

--
-- Name: Brand_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE public."Brand_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Brand_id_seq" OWNER TO mac;

--
-- Name: Brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE public."Brand_id_seq" OWNED BY public."Brand".id;


--
-- Name: Car; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE public."Car" (
    id integer NOT NULL,
    "brandId" integer NOT NULL,
    model text NOT NULL,
    "yearMade" integer NOT NULL,
    price double precision NOT NULL,
    stock integer DEFAULT 1 NOT NULL,
    "imageUrl" text,
    specifications jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Car" OWNER TO mac;

--
-- Name: Car_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE public."Car_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Car_id_seq" OWNER TO mac;

--
-- Name: Car_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE public."Car_id_seq" OWNED BY public."Car".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    "senderId" text NOT NULL,
    "receiverId" text NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Message" OWNER TO mac;

--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Message_id_seq" OWNER TO mac;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: Reservation; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE public."Reservation" (
    id integer NOT NULL,
    "customerId" text NOT NULL,
    "carId" integer NOT NULL,
    "salesId" text,
    "inspectionDate" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Reservation" OWNER TO mac;

--
-- Name: Reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE public."Reservation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Reservation_id_seq" OWNER TO mac;

--
-- Name: Reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE public."Reservation_id_seq" OWNED BY public."Reservation".id;


--
-- Name: Setting; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE public."Setting" (
    key text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public."Setting" OWNER TO mac;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE public."Transaction" (
    id integer NOT NULL,
    "customerId" text NOT NULL,
    "carId" integer NOT NULL,
    amount integer DEFAULT 1 NOT NULL,
    "totalPrice" double precision NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO mac;

--
-- Name: Transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE public."Transaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Transaction_id_seq" OWNER TO mac;

--
-- Name: Transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE public."Transaction_id_seq" OWNED BY public."Transaction".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    phone text,
    address text,
    role text DEFAULT 'CUSTOMER'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO mac;

--
-- Name: Brand id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Brand" ALTER COLUMN id SET DEFAULT nextval('public."Brand_id_seq"'::regclass);


--
-- Name: Car id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Car" ALTER COLUMN id SET DEFAULT nextval('public."Car_id_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: Reservation id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Reservation" ALTER COLUMN id SET DEFAULT nextval('public."Reservation_id_seq"'::regclass);


--
-- Name: Transaction id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Transaction" ALTER COLUMN id SET DEFAULT nextval('public."Transaction_id_seq"'::regclass);


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY public."Brand" (id, name, "imageUrl", "createdAt", "updatedAt") FROM stdin;
1	BMW	3.png	2026-06-13 21:37:58.943	2026-06-13 21:37:58.943
2	Buggati	8.png	2026-06-13 21:37:58.946	2026-06-13 21:37:58.946
3	Cadillac	6.png	2026-06-13 21:37:58.95	2026-06-13 21:37:58.95
4	Ferrari	2.png	2026-06-13 21:37:58.952	2026-06-13 21:37:58.952
5	Honda	7.png	2026-06-13 21:37:58.953	2026-06-13 21:37:58.953
6	Koenigsegg	1.png\r\n	2026-06-13 21:37:58.954	2026-06-13 21:37:58.954
7	McLaren	5.png	2026-06-13 21:37:58.956	2026-06-13 21:37:58.956
8	Mercedes-Benz	4.png	2026-06-13 21:37:58.956	2026-06-13 21:37:58.956
9	Toyota	Toyota1.png	2026-06-13 21:37:58.957	2026-06-13 21:37:58.957
\.


--
-- Data for Name: Car; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY public."Car" (id, "brandId", model, "yearMade", price, stock, "imageUrl", specifications, "createdAt", "updatedAt") FROM stdin;
3	4	812	2020	350000	2	4.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "5.000 km", "condition": "Pre-Owned"}, "performance": {"torque": "600 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "450 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.968	2026-06-14 19:56:00.11
4	1	M4	2021	75595	2	5.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "0 km", "condition": "Baru"}, "performance": {"torque": "476 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "326 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.969	2026-06-14 19:56:00.111
2	7	F1	1996	20000000	0	2.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "0 km", "condition": "Baru"}, "performance": {"torque": "621 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "471 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.967	2026-06-22 13:27:19.17
5	1	M8	2022	130000	1	6.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "26.000 km", "condition": "Pre-Owned"}, "performance": {"torque": "579 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "429 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.969	2026-06-14 19:56:00.112
6	3	Escalade	2021	76195	3	7.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "0 km", "condition": "Baru"}, "performance": {"torque": "679 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "529 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.97	2026-06-14 19:56:00.131
7	6	One:1	2013	2500000	1	Koenigsegg_One.jpg	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "0 km", "condition": "Baru"}, "performance": {"torque": "774 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "624 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.971	2026-06-14 19:56:00.134
1	6	Agera	2013	2500000	2	1.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "0 km", "condition": "Baru"}, "performance": {"torque": "740 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "590 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.964	2026-06-19 15:13:36.561
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY public."Message" (id, "senderId", "receiverId", content, "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: Reservation; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY public."Reservation" (id, "customerId", "carId", "salesId", "inspectionDate", status, notes, "createdAt", "updatedAt") FROM stdin;
1	190626311915	1	\N	2026-06-18 15:05:00	PENDING		2026-06-18 15:06:17.184	2026-06-18 15:06:17.184
2	190626311915	1	\N	2026-06-19 15:20:00	PENDING	{"fullName":"Nom Nom","email":"nomnom20041@gmail.com","identityNumber":"3310331033103310","userNotes":""}	2026-06-18 15:20:31.022	2026-06-18 15:20:31.022
\.


--
-- Data for Name: Setting; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY public."Setting" (key, value) FROM stdin;
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY public."Transaction" (id, "customerId", "carId", amount, "totalPrice", status, "createdAt", "updatedAt") FROM stdin;
1	190626311915	2	1	2000000	PENDING	2025-01-21 17:00:00	2026-06-13 21:37:58.978
2	220626280089	2	1	20000000	PENDING	2026-06-22 13:27:19.148	2026-06-22 13:27:19.148
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY public."User" (id, username, password, email, phone, address, role, "createdAt", "updatedAt") FROM stdin;
190626311915	Zetian	Wu	zetinwu@gmail.com	085158941664	Susquehanna	CUSTOMER	2026-06-13 21:37:58.974	2026-06-13 21:37:58.974
190626722139	Epicerie Kiosk	$2b$10$2F6.R.eLOt7WdUJUXWdsrOO0aqPDKI3HZjR8yqpsJ0pANKWyWFCRu	epiceriekiosk@gmail.com	\N	\N	CUSTOMER	2026-06-18 15:29:45.664	2026-06-18 15:29:45.664
190626901984	Alfa	$2b$10$yvbszlFq/L4xwiRGbNV4QOzyyA3TL9uFHiErJNQETf820vGvosGUC	nakadaalpha@gmail.com	\N	\N	ADMIN	2026-06-19 13:17:01.948	2026-06-19 13:28:40.469
220626433561	zetiansales	$2b$10$4SGEgd6VVb22NXYaaNbrf.kyWTXYqM8R/mHHpzHpXXpsjmvKVEQ9W	zetiansales@notnull.com	\N	\N	CUSTOMER	2026-06-21 18:13:19.027	2026-06-21 18:13:19.027
220626280089	admin	$2b$10$8wbgO/EhXH00slpnp1wiwevVnvL/cmozRJxgHYdOL544mbD0Xpr/G	admin@notnull.com			ADMIN	2026-06-21 18:18:17.314	2026-06-21 18:21:06.692
190626588587	sales	$2b$10$/Slln5wns8G/uXbuG0ANA.qAgixQkwwXjULy/EbqPHIKl42WQ8GTK	sales@notnull.com			SALES	2026-06-13 23:17:38.571	2026-06-21 18:35:16.51
\.


--
-- Name: Brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('public."Brand_id_seq"', 1, false);


--
-- Name: Car_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('public."Car_id_seq"', 1, false);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('public."Message_id_seq"', 1, false);


--
-- Name: Reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('public."Reservation_id_seq"', 2, true);


--
-- Name: Transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('public."Transaction_id_seq"', 2, true);


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);


--
-- Name: Car Car_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Car"
    ADD CONSTRAINT "Car_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Reservation Reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Reservation"
    ADD CONSTRAINT "Reservation_pkey" PRIMARY KEY (id);


--
-- Name: Setting Setting_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Setting"
    ADD CONSTRAINT "Setting_pkey" PRIMARY KEY (key);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Brand_name_key; Type: INDEX; Schema: public; Owner: mac
--

CREATE UNIQUE INDEX "Brand_name_key" ON public."Brand" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: mac
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: mac
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Car Car_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Car"
    ADD CONSTRAINT "Car_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reservation Reservation_carId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Reservation"
    ADD CONSTRAINT "Reservation_carId_fkey" FOREIGN KEY ("carId") REFERENCES public."Car"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reservation Reservation_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Reservation"
    ADD CONSTRAINT "Reservation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reservation Reservation_salesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Reservation"
    ADD CONSTRAINT "Reservation_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_carId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_carId_fkey" FOREIGN KEY ("carId") REFERENCES public."Car"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: mac
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 0WDyhDMVhBIjqWd8VXl3EbUHSUQqcHE3h8CYIjnLJlxbbdNWKQsI5JPhyPqO4Qh

