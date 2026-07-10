-- ============================================================
-- AI Career Mentor Portal - MySQL Database Schema
-- Lenovo LEAP Internship Capstone Project
-- ============================================================
-- Create database
CREATE DATABASE IF NOT EXISTS career_mentor
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE career_mentor;

-- ------------------------------------------------------------
-- Users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  uid           VARCHAR(128) NOT NULL UNIQUE,
  name          VARCHAR(128) NOT NULL,
  email         VARCHAR(128) NOT NULL UNIQUE,
  role          VARCHAR(64)  DEFAULT 'Student',
  location      VARCHAR(128),
  phone         VARCHAR(32),
  bio           TEXT,
  avatar        VARCHAR(256),
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Resumes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resumes (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  filename      VARCHAR(256),
  score         FLOAT DEFAULT 0,
  content       TEXT,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Skills (current vs required level per user)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  name          VARCHAR(128) NOT NULL,
  level         FLOAT DEFAULT 0,
  required      FLOAT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Jobs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(128) NOT NULL,
  company       VARCHAR(128),
  location      VARCHAR(128),
  job_type      VARCHAR(64),
  salary        VARCHAR(64),
  match_score   FLOAT DEFAULT 0,
  description   TEXT,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Interviews
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interviews (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  kind          VARCHAR(32),
  question      TEXT,
  answer        TEXT,
  score         FLOAT DEFAULT 0,
  feedback      TEXT,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Roadmaps
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmaps (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  title         VARCHAR(128),
  status        VARCHAR(32),
  weeks         VARCHAR(32),
  detail        TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Career Analyses
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS career_analyses (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  summary       TEXT,
  path          VARCHAR(128),
  market_demand FLOAT DEFAULT 0,
  fit           FLOAT DEFAULT 0,
  data          JSON,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Reports
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  type          VARCHAR(64),
  payload       JSON,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Higher Studies (agent output storage)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS higher_studies (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  program       VARCHAR(128),
  university    VARCHAR(128),
  fit_score     FLOAT DEFAULT 0,
  notes         TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Seed sample jobs
-- ------------------------------------------------------------
INSERT INTO jobs (title, company, location, job_type, salary, match_score, description) VALUES
('Frontend Developer', 'Infosys', 'Bengaluru', 'Full-time', '8-12 LPA', 94, 'Build responsive web UIs with React.'),
('Full Stack Engineer', 'TCS', 'Hyderabad', 'Full-time', '10-14 LPA', 88, 'Own features end-to-end across stack.'),
('React Developer', 'Wipro', 'Pune', 'Contract', '7-9 LPA', 82, 'Develop component libraries.'),
('Software Engineer', 'Cognizant', 'Chennai', 'Full-time', '6-10 LPA', 79, 'Deliver scalable backend services.');

-- Indexes
CREATE INDEX idx_resumes_user  ON resumes(user_id);
CREATE INDEX idx_skills_user    ON skills(user_id);
CREATE INDEX idx_interviews_user ON interviews(user_id);
CREATE INDEX idx_roadmaps_user  ON roadmaps(user_id);
CREATE INDEX idx_ca_user        ON career_analyses(user_id);
CREATE INDEX idx_reports_user   ON reports(user_id);
