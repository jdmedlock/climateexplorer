--
-- PostgreSQL database dump
--

-- Dumped from database version 11.1
-- Dumped by pg_dump version 11.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: climateexplorer; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE climateexplorer WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';


ALTER DATABASE climateexplorer OWNER TO postgres;

\connect climateexplorer

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE climateexplorer; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE climateexplorer IS 'Database supporting the Climate Explorer application. ';


--
-- Name: ce; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA ce;


ALTER SCHEMA ce OWNER TO postgres;

--
-- Name: SCHEMA ce; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA ce IS 'Schema containing the database entities that support the Climate Explorer application.';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Country; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce."Country" (
    code character(2) NOT NULL,
    name character(80) NOT NULL
);


ALTER TABLE ce."Country" OWNER TO postgres;

--
-- Name: DailyWeather; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce."DailyWeather" (
    country_code character(2) NOT NULL,
    network_code character(1) NOT NULL,
    station_id character varying(8) NOT NULL,
    year smallint NOT NULL,
    month smallint NOT NULL,
    element_type character(4) NOT NULL,
    day smallint NOT NULL,
    measurement_flag character(1) NOT NULL,
    quality_flag character(1) NOT NULL,
    source_flag character(1) NOT NULL,
    measurement_value real NOT NULL
);


ALTER TABLE ce."DailyWeather" OWNER TO postgres;

--
-- Name: ElementType; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce."ElementType" (
    type character(4) NOT NULL,
    category character varying(5) NOT NULL,
    description character varying(1024) NOT NULL
);


ALTER TABLE ce."ElementType" OWNER TO postgres;

--
-- Name: MeasurementFlag; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce."MeasurementFlag" (
    code character(1) NOT NULL,
    description character varying(1024) NOT NULL
);


ALTER TABLE ce."MeasurementFlag" OWNER TO postgres;

--
-- Name: Network; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce."Network" (
    code character(1) NOT NULL,
    description character varying(1024) NOT NULL
);


ALTER TABLE ce."Network" OWNER TO postgres;

--
-- Name: Observation; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce."Observation" (
    country_code character(2) NOT NULL,
    network_code character(1) NOT NULL,
    station_id character varying(8) NOT NULL,
    year smallint NOT NULL,
    month smallint NOT NULL,
    element_type character(4) NOT NULL
);


ALTER TABLE ce."Observation" OWNER TO postgres;

--
-- Name: QualityFlag; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce."QualityFlag" (
    code character(1) NOT NULL,
    description character varying(2044) NOT NULL
);


ALTER TABLE ce."QualityFlag" OWNER TO postgres;

--
-- Name: SourceFlag; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce."SourceFlag" (
    code character(1) NOT NULL,
    description character varying(1024) NOT NULL
);


ALTER TABLE ce."SourceFlag" OWNER TO postgres;

--
-- Name: State; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce."State" (
    code character(2) NOT NULL,
    name character varying(1024) NOT NULL
);


ALTER TABLE ce."State" OWNER TO postgres;

--
-- Name: Station; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce."Station" (
    country_code character(2) NOT NULL,
    network_code character(1) NOT NULL,
    station_id character varying(8) NOT NULL,
    latitude real NOT NULL,
    longitude real NOT NULL,
    elevation real NOT NULL,
    state_code character(2) NOT NULL,
    name character varying(30) NOT NULL,
    gsn_flag character(3) NOT NULL,
    hcn_crn_flag character(3) NOT NULL,
    wmo_id character varying(5) NOT NULL
);


ALTER TABLE ce."Station" OWNER TO postgres;

--
-- Name: locations; Type: TABLE; Schema: ce; Owner: postgres
--

CREATE TABLE ce.locations (
    id smallint NOT NULL,
    name character varying(32) NOT NULL
);


ALTER TABLE ce.locations OWNER TO postgres;

--
-- Name: TABLE locations; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON TABLE ce.locations IS 'Table used for testing the PostgreSQL configuration in the Climate Explorer application';


--
-- Data for Name: Country; Type: TABLE DATA; Schema: ce; Owner: postgres
--



--
-- Data for Name: DailyWeather; Type: TABLE DATA; Schema: ce; Owner: postgres
--



--
-- Data for Name: ElementType; Type: TABLE DATA; Schema: ce; Owner: postgres
--



--
-- Data for Name: MeasurementFlag; Type: TABLE DATA; Schema: ce; Owner: postgres
--



--
-- Data for Name: Network; Type: TABLE DATA; Schema: ce; Owner: postgres
--



--
-- Data for Name: Observation; Type: TABLE DATA; Schema: ce; Owner: postgres
--



--
-- Data for Name: QualityFlag; Type: TABLE DATA; Schema: ce; Owner: postgres
--



--
-- Data for Name: SourceFlag; Type: TABLE DATA; Schema: ce; Owner: postgres
--



--
-- Data for Name: State; Type: TABLE DATA; Schema: ce; Owner: postgres
--



--
-- Data for Name: Station; Type: TABLE DATA; Schema: ce; Owner: postgres
--



--
-- Data for Name: locations; Type: TABLE DATA; Schema: ce; Owner: postgres
--

INSERT INTO ce.locations VALUES (1, 'St. Charles');
INSERT INTO ce.locations VALUES (2, 'St. Louis');
INSERT INTO ce.locations VALUES (3, 'Kansas City');
INSERT INTO ce.locations VALUES (4, 'Cape Girardeau');


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: Country unique_Country_code; Type: CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."Country"
    ADD CONSTRAINT "unique_Country_code" UNIQUE (code);


--
-- Name: ElementType unique_ElementType_type; Type: CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."ElementType"
    ADD CONSTRAINT "unique_ElementType_type" UNIQUE (type);


--
-- Name: MeasurementFlag unique_MeasurementFlag_code; Type: CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."MeasurementFlag"
    ADD CONSTRAINT "unique_MeasurementFlag_code" UNIQUE (code);


--
-- Name: Network unique_Network_code; Type: CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."Network"
    ADD CONSTRAINT "unique_Network_code" UNIQUE (code);


--
-- Name: QualityFlag unique_QualityFlag_code; Type: CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."QualityFlag"
    ADD CONSTRAINT "unique_QualityFlag_code" UNIQUE (code);


--
-- Name: SourceFlag unique_SourceFlag_code; Type: CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."SourceFlag"
    ADD CONSTRAINT "unique_SourceFlag_code" UNIQUE (code);


--
-- Name: State unique_State_code; Type: CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."State"
    ADD CONSTRAINT "unique_State_code" UNIQUE (code);


--
-- Name: index_country_pk; Type: INDEX; Schema: ce; Owner: postgres
--

CREATE UNIQUE INDEX index_country_pk ON ce."Country" USING btree (code);


--
-- Name: INDEX index_country_pk; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON INDEX ce.index_country_pk IS 'Primary index on country code';


--
-- Name: index_dailyweather_pd; Type: INDEX; Schema: ce; Owner: postgres
--

CREATE UNIQUE INDEX index_dailyweather_pd ON ce."DailyWeather" USING btree (country_code, network_code, station_id, year, month, element_type, day);


--
-- Name: INDEX index_dailyweather_pd; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON INDEX ce.index_dailyweather_pd IS 'Primary index on country_code, network_code, station_id, year, month, element_type, and day';


--
-- Name: index_elementtype_pk; Type: INDEX; Schema: ce; Owner: postgres
--

CREATE UNIQUE INDEX index_elementtype_pk ON ce."ElementType" USING btree (type);


--
-- Name: INDEX index_elementtype_pk; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON INDEX ce.index_elementtype_pk IS 'Primary index on element type';


--
-- Name: index_measurementflag_pk; Type: INDEX; Schema: ce; Owner: postgres
--

CREATE UNIQUE INDEX index_measurementflag_pk ON ce."MeasurementFlag" USING btree (code);


--
-- Name: INDEX index_measurementflag_pk; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON INDEX ce.index_measurementflag_pk IS 'Primary index on measurement flag';


--
-- Name: index_network_pk; Type: INDEX; Schema: ce; Owner: postgres
--

CREATE UNIQUE INDEX index_network_pk ON ce."Network" USING btree (code);


--
-- Name: INDEX index_network_pk; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON INDEX ce.index_network_pk IS 'Primary index on network code';


--
-- Name: index_observation_pk; Type: INDEX; Schema: ce; Owner: postgres
--

CREATE UNIQUE INDEX index_observation_pk ON ce."Observation" USING btree (country_code, network_code, station_id, year, month, element_type);


--
-- Name: INDEX index_observation_pk; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON INDEX ce.index_observation_pk IS 'Primary index on country_code, network_code, station_id, year, month, element_type';


--
-- Name: index_qualityflag_pk; Type: INDEX; Schema: ce; Owner: postgres
--

CREATE UNIQUE INDEX index_qualityflag_pk ON ce."QualityFlag" USING btree (code);


--
-- Name: INDEX index_qualityflag_pk; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON INDEX ce.index_qualityflag_pk IS 'Primary index on quality flag';


--
-- Name: index_sourceflag_pk; Type: INDEX; Schema: ce; Owner: postgres
--

CREATE UNIQUE INDEX index_sourceflag_pk ON ce."SourceFlag" USING btree (code);


--
-- Name: INDEX index_sourceflag_pk; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON INDEX ce.index_sourceflag_pk IS 'Primary index on source code';


--
-- Name: index_state_pk; Type: INDEX; Schema: ce; Owner: postgres
--

CREATE UNIQUE INDEX index_state_pk ON ce."State" USING btree (code);


--
-- Name: INDEX index_state_pk; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON INDEX ce.index_state_pk IS 'Primary index on state code';


--
-- Name: index_station_pk; Type: INDEX; Schema: ce; Owner: postgres
--

CREATE UNIQUE INDEX index_station_pk ON ce."Station" USING btree (country_code, network_code, station_id);


--
-- Name: INDEX index_station_pk; Type: COMMENT; Schema: ce; Owner: postgres
--

COMMENT ON INDEX ce.index_station_pk IS 'Primary index on country_code, network_code, and station_id';


--
-- Name: Station lnk_Country_Station; Type: FK CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."Station"
    ADD CONSTRAINT "lnk_Country_Station" FOREIGN KEY (country_code) REFERENCES ce."Country"(code) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Observation lnk_ElementType_Observation; Type: FK CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."Observation"
    ADD CONSTRAINT "lnk_ElementType_Observation" FOREIGN KEY (element_type) REFERENCES ce."ElementType"(type) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DailyWeather lnk_MeasurementFlag_DailyWeather; Type: FK CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."DailyWeather"
    ADD CONSTRAINT "lnk_MeasurementFlag_DailyWeather" FOREIGN KEY (measurement_flag) REFERENCES ce."MeasurementFlag"(code) MATCH FULL ON UPDATE CASCADE;


--
-- Name: Station lnk_Network_Station; Type: FK CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."Station"
    ADD CONSTRAINT "lnk_Network_Station" FOREIGN KEY (network_code) REFERENCES ce."Network"(code) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DailyWeather lnk_Observation_DailyWeather; Type: FK CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."DailyWeather"
    ADD CONSTRAINT "lnk_Observation_DailyWeather" FOREIGN KEY (country_code, network_code, station_id, year, month, element_type) REFERENCES ce."Observation"(country_code, network_code, station_id, year, month, element_type) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DailyWeather lnk_QualityFlag_DailyWeather; Type: FK CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."DailyWeather"
    ADD CONSTRAINT "lnk_QualityFlag_DailyWeather" FOREIGN KEY (quality_flag) REFERENCES ce."QualityFlag"(code) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DailyWeather lnk_SourceFlag_DailyWeather; Type: FK CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."DailyWeather"
    ADD CONSTRAINT "lnk_SourceFlag_DailyWeather" FOREIGN KEY (source_flag) REFERENCES ce."SourceFlag"(code) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Station lnk_State_Station; Type: FK CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."Station"
    ADD CONSTRAINT "lnk_State_Station" FOREIGN KEY (state_code) REFERENCES ce."State"(code) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Observation lnk_Station_Observation; Type: FK CONSTRAINT; Schema: ce; Owner: postgres
--

ALTER TABLE ONLY ce."Observation"
    ADD CONSTRAINT "lnk_Station_Observation" FOREIGN KEY (country_code, network_code, station_id) REFERENCES ce."Station"(country_code, network_code, station_id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

