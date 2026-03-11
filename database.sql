-- Create the neurotwin database if it doesn't exist
CREATE DATABASE IF NOT EXISTS neurotwin;
USE neurotwin;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  study_hours DECIMAL(4,2),
  sleep_hours DECIMAL(4,2),
  screen_time DECIMAL(4,2),
  physical_activity DECIMAL(4,2),
  log_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
