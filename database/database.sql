CREATE DATABASE electionSys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE electionSys;

CREATE TABLE users(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    username varchar(75) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username(username),
    INDEX idx_password(password_hash)
);

CREATE TABLE elections(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name_election VARCHAR(150) NOT NULL,
    `description` TEXT,
    start_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP NOT NULL,
    `status` ENUM("OPEN","HAPPENING","CLOSED","SUSPENDED") NOT NULL DEFAULT "OPEN",
    created_by INT NOT NULL,
    FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_name_election(name_election)
);
CREATE TABLE elections_photos (
    election_id INT UNIQUE NOT NULL,
    `filename` VARCHAR(355) NOT NULL,
    filepath VARCHAR(355) NOT NULL,
    FOREIGN KEY(election_id) REFERENCES elections(id) ON DELETE CASCADE
);

CREATE TABLE voters(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    election_id INT NOT NULL,
    email_hash VARCHAR(255) NOT NULL,
	FOREIGN KEY(election_id) REFERENCES elections(id) ON DELETE CASCADE,
    UNIQUE KEY unique_voter (email_hash,election_id)
);

CREATE TABLE candidates(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    voter_id INT NOT NULL,
    election_id INT NOT NULL,
    name_candidate VARCHAR(125) NOT NULL,
    `status` ENUM("ACTIVE","SUSPENDED") NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(voter_id) REFERENCES voters(id) ON DELETE CASCADE,
	FOREIGN KEY(election_id) REFERENCES elections(id) ON DELETE CASCADE,
    UNIQUE KEY unique_voter_by_election (voter_id,election_id)
);
CREATE TABLE candidates_photos (
    candidate_id INT UNIQUE NOT NULL,
    `filename` VARCHAR(355) NOT NULL,
    filepath VARCHAR(355) NOT NULL,
    FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE TABLE vote (
    voter_id INT UNIQUE NOT NULL,
    candidate_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(voter_id) REFERENCES voters(id) ON DELETE CASCADE,
    FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);