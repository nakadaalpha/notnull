--
-- PostgreSQL database dump
--

\restrict 77H9F27iNm2AzsvTGnUc2gwTIUp08vl7LkWjRtbylcieW6PCeoAPACZ0JwfErR1

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

ALTER TABLE IF EXISTS ONLY "public"."Transaction" DROP CONSTRAINT IF EXISTS "Transaction_tradeInId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."Transaction" DROP CONSTRAINT IF EXISTS "Transaction_salesId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."Transaction" DROP CONSTRAINT IF EXISTS "Transaction_customerId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."Transaction" DROP CONSTRAINT IF EXISTS "Transaction_carId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."TradeIn" DROP CONSTRAINT IF EXISTS "TradeIn_mechanicId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."TradeIn" DROP CONSTRAINT IF EXISTS "TradeIn_customerId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."TestDrive" DROP CONSTRAINT IF EXISTS "TestDrive_salesId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."TestDrive" DROP CONSTRAINT IF EXISTS "TestDrive_customerId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."TestDrive" DROP CONSTRAINT IF EXISTS "TestDrive_carId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."Reservation" DROP CONSTRAINT IF EXISTS "Reservation_salesId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."Reservation" DROP CONSTRAINT IF EXISTS "Reservation_customerId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."Reservation" DROP CONSTRAINT IF EXISTS "Reservation_carId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."Message" DROP CONSTRAINT IF EXISTS "Message_senderId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."Message" DROP CONSTRAINT IF EXISTS "Message_receiverId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."Car" DROP CONSTRAINT IF EXISTS "Car_brandId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."CarDocument" DROP CONSTRAINT IF EXISTS "CarDocument_carId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_userId_fkey";
DROP INDEX IF EXISTS "public"."User_username_key";
DROP INDEX IF EXISTS "public"."User_email_key";
DROP INDEX IF EXISTS "public"."Transaction_tradeInId_key";
DROP INDEX IF EXISTS "public"."CarDocument_carId_key";
DROP INDEX IF EXISTS "public"."Brand_name_key";
ALTER TABLE IF EXISTS ONLY "public"."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY "public"."Transaction" DROP CONSTRAINT IF EXISTS "Transaction_pkey";
ALTER TABLE IF EXISTS ONLY "public"."TradeIn" DROP CONSTRAINT IF EXISTS "TradeIn_pkey";
ALTER TABLE IF EXISTS ONLY "public"."TestDrive" DROP CONSTRAINT IF EXISTS "TestDrive_pkey";
ALTER TABLE IF EXISTS ONLY "public"."Setting" DROP CONSTRAINT IF EXISTS "Setting_pkey";
ALTER TABLE IF EXISTS ONLY "public"."Reservation" DROP CONSTRAINT IF EXISTS "Reservation_pkey";
ALTER TABLE IF EXISTS ONLY "public"."Message" DROP CONSTRAINT IF EXISTS "Message_pkey";
ALTER TABLE IF EXISTS ONLY "public"."Car" DROP CONSTRAINT IF EXISTS "Car_pkey";
ALTER TABLE IF EXISTS ONLY "public"."CarDocument" DROP CONSTRAINT IF EXISTS "CarDocument_pkey";
ALTER TABLE IF EXISTS ONLY "public"."Brand" DROP CONSTRAINT IF EXISTS "Brand_pkey";
ALTER TABLE IF EXISTS ONLY "public"."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_pkey";
ALTER TABLE IF EXISTS "public"."Transaction" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."TradeIn" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."TestDrive" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."Reservation" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."Message" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."CarDocument" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."Car" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."Brand" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."AuditLog" ALTER COLUMN "id" DROP DEFAULT;
DROP TABLE IF EXISTS "public"."User";
DROP SEQUENCE IF EXISTS "public"."Transaction_id_seq";
DROP TABLE IF EXISTS "public"."Transaction";
DROP SEQUENCE IF EXISTS "public"."TradeIn_id_seq";
DROP TABLE IF EXISTS "public"."TradeIn";
DROP SEQUENCE IF EXISTS "public"."TestDrive_id_seq";
DROP TABLE IF EXISTS "public"."TestDrive";
DROP TABLE IF EXISTS "public"."Setting";
DROP SEQUENCE IF EXISTS "public"."Reservation_id_seq";
DROP TABLE IF EXISTS "public"."Reservation";
DROP SEQUENCE IF EXISTS "public"."Message_id_seq";
DROP TABLE IF EXISTS "public"."Message";
DROP SEQUENCE IF EXISTS "public"."Car_id_seq";
DROP SEQUENCE IF EXISTS "public"."CarDocument_id_seq";
DROP TABLE IF EXISTS "public"."CarDocument";
DROP TABLE IF EXISTS "public"."Car";
DROP SEQUENCE IF EXISTS "public"."Brand_id_seq";
DROP TABLE IF EXISTS "public"."Brand";
DROP SEQUENCE IF EXISTS "public"."AuditLog_id_seq";
DROP TABLE IF EXISTS "public"."AuditLog";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: mac
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA "public" OWNER TO "mac";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."AuditLog" (
    "id" integer NOT NULL,
    "userId" "text" NOT NULL,
    "action" "text" NOT NULL,
    "resource" "text",
    "ipAddress" "text",
    "payload" "jsonb",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."AuditLog" OWNER TO "mac";

--
-- Name: AuditLog_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE "public"."AuditLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."AuditLog_id_seq" OWNER TO "mac";

--
-- Name: AuditLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE "public"."AuditLog_id_seq" OWNED BY "public"."AuditLog"."id";


--
-- Name: Brand; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."Brand" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "imageUrl" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Brand" OWNER TO "mac";

--
-- Name: Brand_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE "public"."Brand_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."Brand_id_seq" OWNER TO "mac";

--
-- Name: Brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE "public"."Brand_id_seq" OWNED BY "public"."Brand"."id";


--
-- Name: Car; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."Car" (
    "id" integer NOT NULL,
    "brandId" integer NOT NULL,
    "model" "text" NOT NULL,
    "yearMade" integer NOT NULL,
    "price" double precision NOT NULL,
    "stock" integer DEFAULT 1 NOT NULL,
    "imageUrl" "text",
    "specifications" "jsonb",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Car" OWNER TO "mac";

--
-- Name: CarDocument; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."CarDocument" (
    "id" integer NOT NULL,
    "carId" integer NOT NULL,
    "has_bpkb" boolean DEFAULT false NOT NULL,
    "has_stnk" boolean DEFAULT false NOT NULL,
    "stnk_expiry_date" timestamp(3) without time zone,
    "has_faktur" boolean DEFAULT false NOT NULL,
    "has_kwitansi_blanko" boolean DEFAULT false NOT NULL,
    "has_form_a" boolean DEFAULT false NOT NULL,
    "scanned_files" "jsonb",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "licensePlate" "text",
    "vin" "text"
);


ALTER TABLE "public"."CarDocument" OWNER TO "mac";

--
-- Name: CarDocument_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE "public"."CarDocument_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."CarDocument_id_seq" OWNER TO "mac";

--
-- Name: CarDocument_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE "public"."CarDocument_id_seq" OWNED BY "public"."CarDocument"."id";


--
-- Name: Car_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE "public"."Car_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."Car_id_seq" OWNER TO "mac";

--
-- Name: Car_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE "public"."Car_id_seq" OWNED BY "public"."Car"."id";


--
-- Name: Message; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."Message" (
    "id" integer NOT NULL,
    "senderId" "text" NOT NULL,
    "receiverId" "text" NOT NULL,
    "content" "text" NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."Message" OWNER TO "mac";

--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE "public"."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."Message_id_seq" OWNER TO "mac";

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE "public"."Message_id_seq" OWNED BY "public"."Message"."id";


--
-- Name: Reservation; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."Reservation" (
    "id" integer NOT NULL,
    "customerId" "text" NOT NULL,
    "carId" integer NOT NULL,
    "salesId" "text",
    "inspectionDate" timestamp(3) without time zone NOT NULL,
    "status" "text" DEFAULT 'PENDING'::"text" NOT NULL,
    "notes" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Reservation" OWNER TO "mac";

--
-- Name: Reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE "public"."Reservation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."Reservation_id_seq" OWNER TO "mac";

--
-- Name: Reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE "public"."Reservation_id_seq" OWNED BY "public"."Reservation"."id";


--
-- Name: Setting; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."Setting" (
    "key" "text" NOT NULL,
    "value" "text" NOT NULL
);


ALTER TABLE "public"."Setting" OWNER TO "mac";

--
-- Name: TestDrive; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."TestDrive" (
    "id" integer NOT NULL,
    "carId" integer NOT NULL,
    "customerId" "text" NOT NULL,
    "salesId" "text",
    "schedule_date" timestamp(3) without time zone NOT NULL,
    "location_type" "text" DEFAULT 'SHOWROOM'::"text" NOT NULL,
    "liability_agreed" boolean DEFAULT false NOT NULL,
    "liability_agreed_at" timestamp(3) without time zone,
    "status" "text" DEFAULT 'REQUESTED'::"text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."TestDrive" OWNER TO "mac";

--
-- Name: TestDrive_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE "public"."TestDrive_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."TestDrive_id_seq" OWNER TO "mac";

--
-- Name: TestDrive_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE "public"."TestDrive_id_seq" OWNED BY "public"."TestDrive"."id";


--
-- Name: TradeIn; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."TradeIn" (
    "id" integer NOT NULL,
    "customerId" "text" NOT NULL,
    "licensePlate" "text" NOT NULL,
    "brand" "text" NOT NULL,
    "model" "text" NOT NULL,
    "year" integer NOT NULL,
    "photoUrl" "text",
    "status" "text" DEFAULT 'TRADE_IN_PENDING'::"text" NOT NULL,
    "appraisedValue" double precision,
    "notes" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "inspectionDate" timestamp(3) without time zone,
    "mechanicId" "text"
);


ALTER TABLE "public"."TradeIn" OWNER TO "mac";

--
-- Name: TradeIn_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE "public"."TradeIn_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."TradeIn_id_seq" OWNER TO "mac";

--
-- Name: TradeIn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE "public"."TradeIn_id_seq" OWNED BY "public"."TradeIn"."id";


--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."Transaction" (
    "id" integer NOT NULL,
    "customerId" "text" NOT NULL,
    "carId" integer NOT NULL,
    "amount" integer DEFAULT 1 NOT NULL,
    "totalPrice" double precision NOT NULL,
    "status" "text" DEFAULT 'PENDING_PAYMENT'::"text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "bookingFee" double precision,
    "invoiceUrl" "text",
    "salesId" "text",
    "tradeInId" integer
);


ALTER TABLE "public"."Transaction" OWNER TO "mac";

--
-- Name: Transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: mac
--

CREATE SEQUENCE "public"."Transaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."Transaction_id_seq" OWNER TO "mac";

--
-- Name: Transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mac
--

ALTER SEQUENCE "public"."Transaction_id_seq" OWNED BY "public"."Transaction"."id";


--
-- Name: User; Type: TABLE; Schema: public; Owner: mac
--

CREATE TABLE "public"."User" (
    "id" "text" NOT NULL,
    "username" "text" NOT NULL,
    "password" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "address" "text",
    "role" "text" DEFAULT 'CUSTOMER'::"text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "is_sim_verified" boolean DEFAULT false NOT NULL,
    "sim_expiry_date" timestamp(3) without time zone,
    "sim_file_path" "text",
    "sim_number" "text"
);


ALTER TABLE "public"."User" OWNER TO "mac";

--
-- Name: AuditLog id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."AuditLog" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."AuditLog_id_seq"'::"regclass");


--
-- Name: Brand id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Brand" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Brand_id_seq"'::"regclass");


--
-- Name: Car id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Car" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Car_id_seq"'::"regclass");


--
-- Name: CarDocument id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."CarDocument" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."CarDocument_id_seq"'::"regclass");


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Message" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Message_id_seq"'::"regclass");


--
-- Name: Reservation id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Reservation" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Reservation_id_seq"'::"regclass");


--
-- Name: TestDrive id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."TestDrive" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."TestDrive_id_seq"'::"regclass");


--
-- Name: TradeIn id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."TradeIn" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."TradeIn_id_seq"'::"regclass");


--
-- Name: Transaction id; Type: DEFAULT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Transaction" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Transaction_id_seq"'::"regclass");


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY "public"."AuditLog" ("id", "userId", "action", "resource", "ipAddress", "payload", "createdAt") FROM stdin;
1	230626740597	POST /api/transactions/checkout	/api/transactions/checkout	::1	{"carId": 4, "tradeInId": null, "customerId": "230626740597"}	2026-07-08 06:29:36.976
2	230626740597	PUT /api/transactions/6/cancel	/api/transactions/6/cancel	::1	null	2026-07-08 07:52:10.187
3	230626740597	POST /api/transactions/checkout	/api/transactions/checkout	::1	{"carId": 4, "tradeInId": null, "customerId": "230626740597"}	2026-07-08 07:52:28.125
4	230626740597	POST /api/transactions/checkout	/api/transactions/checkout	::1	{"carId": 4, "tradeInId": null, "customerId": "230626740597"}	2026-07-08 07:53:23.616
5	230626740597	POST /api/users/kyc/sim	/api/users/kyc/sim	::1	{"simExpiry": "2026-07-12", "simNumber": "1234567812345678"}	2026-07-12 15:36:53.62
6	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T09:00:00.000Z", "liabilityAgreed": true}	2026-07-12 15:37:40.315
7	230626740597	POST /api/users/kyc/sim	/api/users/kyc/sim	::1	{"simExpiry": "2026-07-31", "simNumber": "1234567812345678"}	2026-07-12 15:40:50.313
8	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:41:03.514
9	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:41:07.174
10	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:41:08.062
11	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:15.497
12	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:16.049
13	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:16.204
14	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:16.348
15	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:16.463
16	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:16.593
17	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:16.728
18	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:16.897
19	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:17.063
20	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:41:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:17.23
21	230626740597	POST /api/users/kyc/sim	/api/users/kyc/sim	::1	{"simExpiry": "2026-07-12", "simNumber": "1234567812345678"}	2026-07-12 15:42:42.894
22	230626740597	POST /api/test-drives	/api/test-drives	::1	{"carId": 7, "locationType": "SHOWROOM", "scheduleDate": "2026-07-19T15:42:00.000Z", "liabilityAgreed": true}	2026-07-12 15:42:50.13
23	220626280089	POST /api/transactions/checkout	/api/transactions/checkout	::1	{"carId": 5, "tradeInId": null, "customerId": "220626280089"}	2026-07-13 07:22:23.351
\.


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY "public"."Brand" ("id", "name", "imageUrl", "createdAt", "updatedAt") FROM stdin;
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

COPY "public"."Car" ("id", "brandId", "model", "yearMade", "price", "stock", "imageUrl", "specifications", "createdAt", "updatedAt") FROM stdin;
3	4	812	2020	350000	2	4.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "5.000 km", "condition": "Pre-Owned"}, "performance": {"torque": "600 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "450 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.968	2026-06-14 19:56:00.11
2	7	F1	1996	20000000	0	2.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "0 km", "condition": "Baru"}, "performance": {"torque": "621 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "471 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.967	2026-06-22 13:27:19.17
5	1	M8	2022	130000	1	6.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "26.000 km", "condition": "Pre-Owned"}, "performance": {"torque": "579 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "429 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.969	2026-06-14 19:56:00.112
6	3	Escalade	2021	76195	3	7.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "0 km", "condition": "Baru"}, "performance": {"torque": "679 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "529 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.97	2026-06-14 19:56:00.131
7	6	One:1	2013	2500000	1	Koenigsegg_One.jpg	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "0 km", "condition": "Baru"}, "performance": {"torque": "774 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "624 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.971	2026-06-14 19:56:00.134
1	6	Agera	2013	2500000	2	1.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "0 km", "condition": "Baru"}, "performance": {"torque": "740 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "590 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.964	2026-07-01 09:11:36.665
4	1	M4	2021	75595	3	5.png	{"interior": {"cockpit": ["Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters", "Instrumen: Virtual Cockpit Digital Display", "Spion: Auto-dimming dengan Compass"], "comfort": ["Material Jok: Kulit Nappa Premium dengan Alcantara", "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas", "AC: Auto Climate Control (Quad-zone)"], "utility": ["Trim: Open-pore Wood & Brushed Aluminium", "Bagasi: 605 Liter (Bisa diekspansi)", "Atap: Panoramic Sunroof"], "infotainment": ["Layar: 12.3 inci Touchscreen System", "Konektivitas: Wireless Apple CarPlay & Android Auto", "Audio: Bang & Olufsen 3D Premium Sound System", "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"]}, "dimensions": {"wheelbase": "2995 mm", "curb_weight": "2200 kg", "fuel_capacity": "85 L", "ground_clearance": "190 mm", "length_width_height": "4924 x 1983 x 1696 mm"}, "hero_specs": {"trim": "Luxury Trim", "mileage": "0 km", "condition": "Baru"}, "performance": {"torque": "476 Nm @ 3500 RPM", "drivetrain": "AWD (Rear-biased)", "horsepower": "326 HP @ 6500 RPM", "engine_type": "4.0L Twin-Turbo V8", "acceleration": "3.8s (0-100 km/h)", "transmission": "8-Speed Dual Clutch (DCT)"}, "safety_and_features": {"active_safety": ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"], "passive_safety": ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"], "exterior_features": ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]}}	2026-06-13 21:37:58.969	2026-07-08 07:52:10.167
\.


--
-- Data for Name: CarDocument; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY "public"."CarDocument" ("id", "carId", "has_bpkb", "has_stnk", "stnk_expiry_date", "has_faktur", "has_kwitansi_blanko", "has_form_a", "scanned_files", "createdAt", "updatedAt", "licensePlate", "vin") FROM stdin;
1	1	t	f	\N	f	f	f	["1782831875873-Epicerie_Portofolio_Academy.pdf"]	2026-06-30 15:04:45.758	2026-07-01 09:11:36.718	\N	\N
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY "public"."Message" ("id", "senderId", "receiverId", "content", "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: Reservation; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY "public"."Reservation" ("id", "customerId", "carId", "salesId", "inspectionDate", "status", "notes", "createdAt", "updatedAt") FROM stdin;
1	190626311915	1	\N	2026-06-18 15:05:00	PENDING		2026-06-18 15:06:17.184	2026-06-18 15:06:17.184
2	190626311915	1	\N	2026-06-19 15:20:00	PENDING	{"fullName":"Nom Nom","email":"nomnom20041@gmail.com","identityNumber":"3310331033103310","userNotes":""}	2026-06-18 15:20:31.022	2026-06-18 15:20:31.022
\.


--
-- Data for Name: Setting; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY "public"."Setting" ("key", "value") FROM stdin;
\.


--
-- Data for Name: TestDrive; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY "public"."TestDrive" ("id", "carId", "customerId", "salesId", "schedule_date", "location_type", "liability_agreed", "liability_agreed_at", "status", "createdAt", "updatedAt") FROM stdin;
1	7	230626740597	\N	2026-07-19 15:42:00	SHOWROOM	t	2026-07-12 15:42:50.124	REQUESTED	2026-07-12 15:42:50.125	2026-07-12 15:42:50.125
\.


--
-- Data for Name: TradeIn; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY "public"."TradeIn" ("id", "customerId", "licensePlate", "brand", "model", "year", "photoUrl", "status", "appraisedValue", "notes", "createdAt", "updatedAt", "inspectionDate", "mechanicId") FROM stdin;
2	230626740597	ad4879AQC	BMW	M2	2026	\N	TRADE_IN_PENDING	\N	mint	2026-06-23 14:17:38.506	2026-06-23 14:17:38.506	\N	\N
3	230626740597	adadfasdf	asdfasdf	asdfasdf	2026	\N	INSPECTION_SCHEDULED	\N	asdf	2026-06-23 14:20:01.426	2026-06-24 10:39:29.556	2026-06-30 09:00:00	240626619466
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY "public"."Transaction" ("id", "customerId", "carId", "amount", "totalPrice", "status", "createdAt", "updatedAt", "bookingFee", "invoiceUrl", "salesId", "tradeInId") FROM stdin;
2	220626280089	2	1	20000000	PENDING	2026-06-22 13:27:19.148	2026-06-22 13:27:19.148	\N	\N	\N	\N
4	230626740597	4	1	83910.45	CANCELLED	2026-06-23 14:17:38.554	2026-06-24 14:18:19.116	5000	https://checkout.xendit.co/web/mock-1782224258553	\N	2
5	230626740597	4	1	83910.45	CANCELLED	2026-06-23 14:20:01.471	2026-06-24 14:20:19.067	5000	http://localhost:5173/payment-success?txId=1782224401470	\N	3
1	190626311915	2	1	2000000	AWAITING_PAYMENT	2025-01-21 17:00:00	2026-06-25 15:31:00.752	\N	\N	\N	\N
6	230626740597	4	1	83910.45	CANCELLED	2026-07-08 06:29:36.926	2026-07-08 07:52:10.178	5000	http://localhost:5173/payment-success?txId=1783492176925	\N	\N
7	230626740597	4	1	83910.45	PAID	2026-07-08 07:52:24.725	2026-07-08 07:52:32.269	5000		190626588587	\N
8	230626740597	4	1	83910.45	PAID	2026-07-08 07:53:20.437	2026-07-08 07:53:39.878	5000		190626588587	\N
9	220626280089	5	1	144300	BOOKED	2026-07-13 07:22:19.833	2026-07-13 07:22:26.242	5000		190626588587	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: mac
--

COPY "public"."User" ("id", "username", "password", "email", "phone", "address", "role", "createdAt", "updatedAt", "is_sim_verified", "sim_expiry_date", "sim_file_path", "sim_number") FROM stdin;
190626311915	Zetian	Wu	zetinwu@gmail.com	085158941664	Susquehanna	CUSTOMER	2026-06-13 21:37:58.974	2026-06-13 21:37:58.974	f	\N	\N	\N
190626722139	Epicerie Kiosk	$2b$10$2F6.R.eLOt7WdUJUXWdsrOO0aqPDKI3HZjR8yqpsJ0pANKWyWFCRu	epiceriekiosk@gmail.com	\N	\N	CUSTOMER	2026-06-18 15:29:45.664	2026-06-18 15:29:45.664	f	\N	\N	\N
190626901984	Alfa	$2b$10$yvbszlFq/L4xwiRGbNV4QOzyyA3TL9uFHiErJNQETf820vGvosGUC	nakadaalpha@gmail.com	\N	\N	ADMIN	2026-06-19 13:17:01.948	2026-06-19 13:28:40.469	f	\N	\N	\N
220626433561	zetiansales	$2b$10$4SGEgd6VVb22NXYaaNbrf.kyWTXYqM8R/mHHpzHpXXpsjmvKVEQ9W	zetiansales@notnull.com	\N	\N	CUSTOMER	2026-06-21 18:13:19.027	2026-06-21 18:13:19.027	f	\N	\N	\N
220626280089	admin	$2b$10$8wbgO/EhXH00slpnp1wiwevVnvL/cmozRJxgHYdOL544mbD0Xpr/G	admin@notnull.com			ADMIN	2026-06-21 18:18:17.314	2026-06-21 18:21:06.692	f	\N	\N	\N
190626588587	sales	$2b$10$/Slln5wns8G/uXbuG0ANA.qAgixQkwwXjULy/EbqPHIKl42WQ8GTK	sales@notnull.com			SALES	2026-06-13 23:17:38.571	2026-06-21 18:35:16.51	f	\N	\N	\N
240626445455	manager	$2b$10$.q22SjxdYJ8N1Jy4HFr3cOWpH2rBSeBODAM9EvNF8HQvoVo8EK31a	manager@notnull.com			MANAGER	2026-06-24 08:37:40.19	2026-06-24 08:43:26.048	f	\N	\N	\N
240626619466	mechanic	$2b$10$stDBGP6/JUak5WGk0YgVrOyGz9VrMPy/EMrpUk1Fi7hzdTxuR43RK	mechanic@notnull.com			MECHANIC	2026-06-24 08:43:50.042	2026-06-24 08:44:05.645	f	\N	\N	\N
230626740597	Zetian Wu	$2b$10$zH/FOVXUj68xdob9T4m7hebO8Y4M/DuPY6lWZkQ.ZlhLGI2xrzk1.	zetianwu@gmail.com	\N	\N	CUSTOMER	2026-06-23 13:54:58.565	2026-07-12 15:42:42.864	f	2026-07-12 00:00:00	/uploads/private/users/sim/sim-230626740597-1783870962853-702426043.png	1234567812345678
\.


--
-- Name: AuditLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('"public"."AuditLog_id_seq"', 23, true);


--
-- Name: Brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('"public"."Brand_id_seq"', 1, false);


--
-- Name: CarDocument_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('"public"."CarDocument_id_seq"', 2, true);


--
-- Name: Car_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('"public"."Car_id_seq"', 1, false);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('"public"."Message_id_seq"', 1, false);


--
-- Name: Reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('"public"."Reservation_id_seq"', 2, true);


--
-- Name: TestDrive_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('"public"."TestDrive_id_seq"', 1, true);


--
-- Name: TradeIn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('"public"."TradeIn_id_seq"', 3, true);


--
-- Name: Transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mac
--

SELECT pg_catalog.setval('"public"."Transaction_id_seq"', 9, true);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id");


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY ("id");


--
-- Name: CarDocument CarDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."CarDocument"
    ADD CONSTRAINT "CarDocument_pkey" PRIMARY KEY ("id");


--
-- Name: Car Car_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Car"
    ADD CONSTRAINT "Car_pkey" PRIMARY KEY ("id");


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");


--
-- Name: Reservation Reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Reservation"
    ADD CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id");


--
-- Name: Setting Setting_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Setting"
    ADD CONSTRAINT "Setting_pkey" PRIMARY KEY ("key");


--
-- Name: TestDrive TestDrive_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."TestDrive"
    ADD CONSTRAINT "TestDrive_pkey" PRIMARY KEY ("id");


--
-- Name: TradeIn TradeIn_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."TradeIn"
    ADD CONSTRAINT "TradeIn_pkey" PRIMARY KEY ("id");


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");


--
-- Name: Brand_name_key; Type: INDEX; Schema: public; Owner: mac
--

CREATE UNIQUE INDEX "Brand_name_key" ON "public"."Brand" USING "btree" ("name");


--
-- Name: CarDocument_carId_key; Type: INDEX; Schema: public; Owner: mac
--

CREATE UNIQUE INDEX "CarDocument_carId_key" ON "public"."CarDocument" USING "btree" ("carId");


--
-- Name: Transaction_tradeInId_key; Type: INDEX; Schema: public; Owner: mac
--

CREATE UNIQUE INDEX "Transaction_tradeInId_key" ON "public"."Transaction" USING "btree" ("tradeInId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: mac
--

CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: mac
--

CREATE UNIQUE INDEX "User_username_key" ON "public"."User" USING "btree" ("username");


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CarDocument CarDocument_carId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."CarDocument"
    ADD CONSTRAINT "CarDocument_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Car"("id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Car Car_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Car"
    ADD CONSTRAINT "Car_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Message"
    ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reservation Reservation_carId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Reservation"
    ADD CONSTRAINT "Reservation_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Car"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reservation Reservation_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Reservation"
    ADD CONSTRAINT "Reservation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reservation Reservation_salesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Reservation"
    ADD CONSTRAINT "Reservation_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TestDrive TestDrive_carId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."TestDrive"
    ADD CONSTRAINT "TestDrive_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Car"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestDrive TestDrive_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."TestDrive"
    ADD CONSTRAINT "TestDrive_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestDrive TestDrive_salesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."TestDrive"
    ADD CONSTRAINT "TestDrive_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TradeIn TradeIn_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."TradeIn"
    ADD CONSTRAINT "TradeIn_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TradeIn TradeIn_mechanicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."TradeIn"
    ADD CONSTRAINT "TradeIn_mechanicId_fkey" FOREIGN KEY ("mechanicId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_carId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Transaction"
    ADD CONSTRAINT "Transaction_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Car"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Transaction"
    ADD CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_salesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Transaction"
    ADD CONSTRAINT "Transaction_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_tradeInId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mac
--

ALTER TABLE ONLY "public"."Transaction"
    ADD CONSTRAINT "Transaction_tradeInId_fkey" FOREIGN KEY ("tradeInId") REFERENCES "public"."TradeIn"("id") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: mac
--

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 77H9F27iNm2AzsvTGnUc2gwTIUp08vl7LkWjRtbylcieW6PCeoAPACZ0JwfErR1

