# Election System Database

## Overview

This directory contains the database schema and documentation for the Election System. The system uses a relational database (MySQL) to store election-related data and a NoSQL database (MongoDB) for user profiles and preferences.

## Directory Structure

```
database/
├── dump/
│   └── electionSys.sql          # MySQL database dump
├── EER/
│   └── electionSys.pdf          # Entity-Relationship Diagram
└── README.md                    # This file
```

## Database Schema

### MySQL Database: `electionSys`

The MySQL database contains the core election system data with the following tables:

#### Core Tables

##### `users`
- **Purpose**: Stores system users (administrators and voters)
- **Key Fields**:
  - `id` (BIGINT, Primary Key, Auto Increment)
  - `email` (VARCHAR(255), Unique, Not Null)
  - `password_hash` (TEXT, Not Null)
  - `role` (ENUM: 'admin', 'eleitor')
  - `created_at` (DATE, Default: CURRENT_DATE)

##### `theme`
- **Purpose**: Stores electoral themes created by administrators
- **Key Fields**:
  - `id` (BIGINT, Primary Key, Auto Increment)
  - `user_id` (BIGINT, Foreign Key → users.id)
  - `photo_theme_url` (TEXT)
  - `name` (VARCHAR(75), Not Null)
  - `description` (TEXT)
- **Relationships**: One admin can create multiple themes

##### `elections`
- **Purpose**: Stores election instances within themes
- **Key Fields**:
  - `id` (BIGINT, Primary Key, Auto Increment)
  - `theme_id` (BIGINT, Foreign Key → theme.id)
  - `start_at` (DATETIME, Not Null)
  - `end_at` (DATETIME, Not Null)
  - `status` (ENUM: 'active', 'ongoing', 'closed', Default: 'active')
- **Constraints**: `start_at` must be before `end_at`
- **Relationships**: Each election belongs to one theme

##### `participation`
- **Purpose**: Tracks user participation in elections
- **Key Fields**:
  - `id` (BIGINT, Primary Key, Auto Increment)
  - `user_id` (BIGINT, Foreign Key → users.id)
  - `election_id` (BIGINT, Foreign Key → elections.id)
  - `status` (ENUM: 'eligible', 'ineligible', 'blocked', 'voted', Default: 'ineligible')
- **Constraints**: Unique constraint on (user_id, election_id) - one participation per user per election
- **Relationships**: Links users to elections

##### `candidates`
- **Purpose**: Stores candidate information for elections
- **Key Fields**:
  - `id` (BIGINT, Primary Key, Auto Increment)
  - `participation_id` (BIGINT, Foreign Key → participation.id)
  - `logo_group_url` (TEXT)
  - `group_name` (VARCHAR(35), Not Null)
  - `description` (TEXT)
  - `status` (ENUM: 'eligible', 'ineligible', 'blocked', Default: 'ineligible')
  - `created_at` (TIMESTAMP, Default: CURRENT_TIMESTAMP)
- **Relationships**: Each candidate is linked to a participation (thus to a user and election)

##### `vote`
- **Purpose**: Records votes cast in elections
- **Key Fields**:
  - `id` (BIGINT, Primary Key, Auto Increment)
  - `participation_id` (BIGINT, Foreign Key → participation.id)
  - `candidate_id` (BIGINT, Foreign Key → candidates.id)
  - `created_at` (DATETIME, Default: CURRENT_DATE)
- **Constraints**: Unique constraint on (participation_id, candidate_id) - one vote per participation per candidate
- **Relationships**: Links participation to chosen candidate

#### Additional Tables

##### `candidates_propose`
- **Purpose**: Stores proposals made by candidates
- **Key Fields**:
  - `id` (BIGINT, Primary Key, Auto Increment)
  - `candidate_id` (BIGINT, Foreign Key → candidates.id)
  - `title` (VARCHAR(35), Not Null)
  - `body` (TEXT, Not Null)
- **Relationships**: Each proposal belongs to a candidate

##### `propose_comentary`
- **Purpose**: Stores comments and ratings on candidate proposals
- **Key Fields**:
  - `id` (BIGINT, Primary Key, Auto Increment)
  - `participation_id` (BIGINT, Foreign Key → participation.id)
  - `candidates_propose_id` (BIGINT, Foreign Key → candidates_propose.id)
  - `rating` (ENUM: '1', '2', '3', '4', '5', Not Null)
  - `comentary` (TEXT, Not Null)
- **Constraints**: Unique constraint on (participation_id, candidates_propose_id) - one comment per user per proposal
- **Relationships**: Links participation to proposal comments

##### `audit_logs`
- **Purpose**: Audit trail for important system actions
- **Key Fields**:
  - `id` (BIGINT, Primary Key, Auto Increment)
  - `user_id` (BIGINT, Foreign Key → users.id)
  - `action` (ENUM: 'VOTE_CAST', 'VOTE_ATTEMPT_DUPLICATE', 'ELECTION_CREATED', 'ELECTION_CLOSED')
  - `election_id` (BIGINT, Foreign Key → elections.id)
  - `candidate_id` (BIGINT, Foreign Key → candidates.id, Nullable)
  - `created_at` (TIMESTAMP, Default: CURRENT_TIMESTAMP)
- **Relationships**: Tracks actions performed by users in elections

### MongoDB Collections

#### `profiles`
- **Purpose**: Extended user profile information
- **Structure**: Stores additional user data like username, name, surname, sex, birth date, photo URL

#### `preferences`
- **Purpose**: User preferences and settings
- **Structure**: Stores user preferences like theme selection (light/dark)

## Database Relationships

### Entity Relationship Diagram (ERD)

The Entity-Relationship Diagram is available in `EER/electionSys.pdf`. It visually represents:

1. **Users** create **Themes**
2. **Themes** contain **Elections**
3. **Users** participate in **Elections** (through Participation)
4. **Participation** enables **Candidates** and **Voting**
5. **Candidates** can create **Proposals**
6. **Proposals** receive **Comments** from other participants
7. All actions are logged in **Audit Logs**

### Key Relationships Summary

- **1:N**: users → themes
- **1:N**: themes → elections
- **N:M**: users ↔ elections (through participation)
- **1:1**: participation → candidate (optional)
- **1:N**: participation → votes
- **1:N**: candidates → proposals
- **N:M**: participation ↔ proposals (through comments)

## Setup Instructions

### MySQL Database Setup

1. **Install MySQL** (version 8.0 or higher)

2. **Create Database**:
```sql
CREATE DATABASE electionSys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Import Schema**:
```bash
mysql -u <username> -p electionSys < database/dump/electionSys.sql
```

4. **Verify Installation**:
```sql
USE electionSys;
SHOW TABLES;
```

### MongoDB Setup

1. **Install MongoDB** (version 4.0 or higher)

2. **Start MongoDB service**:
```bash
sudo systemctl start mongod
```

3. **Create Database** (collections are created automatically by the application):
```javascript
use election_system
```

## Data Flow

### Election Process

1. **Administrator** creates a **Theme**
2. **Administrator** creates an **Election** within the theme
3. **Users** register participation in the election
4. **Participants** can become **Candidates** (if eligible)
5. **Candidates** can create **Proposals**
6. **Participants** can comment and rate proposals
7. **Election** opens for voting
8. **Eligible participants** cast **Votes**
9. **Election** closes and results are available

### Status Flow

#### Election Status
- `active`: Election created but not yet started
- `ongoing`: Election is currently active for voting
- `closed`: Election has ended

#### Participation Status
- `eligible`: User can participate fully
- `ineligible`: User cannot participate
- `blocked`: User participation is blocked
- `voted`: User has cast their vote

#### Candidate Status
- `eligible`: Candidate can receive votes
- `ineligible`: Candidate cannot receive votes
- `blocked`: Candidate is blocked from the election

## Backup and Recovery

### MySQL Backup
```bash
mysqldump -u <username> -p electionSys > backup_$(date +%Y%m%d_%H%M%S).sql
```

### MySQL Restore
```bash
mysql -u <username> -p electionSys < backup_file.sql
```

### MongoDB Backup
```bash
mongodump --db election_system --out /path/to/backup
```

### MongoDB Restore
```bash
mongorestore --db election_system /path/to/backup/election_system
```

## Performance Considerations

### Indexes
The database includes appropriate indexes on:
- Foreign key columns
- Frequently queried columns (email, status fields)
- Unique constraints for data integrity

### Query Optimization
- Use prepared statements in application code
- Implement pagination for large result sets
- Monitor slow queries and optimize as needed

## Security

### Data Protection
- Passwords are hashed using bcrypt
- Sensitive data is properly validated
- Foreign key constraints prevent orphaned records
- Audit logs track all critical actions

### Access Control
- Role-based access (admin vs eleitor)
- Session-based authentication
- Input validation and sanitization

## Maintenance

### Regular Tasks
- Monitor database growth
- Archive old election data if needed
- Update statistics and reports
- Review and clean audit logs

### Monitoring
- Track database performance metrics
- Monitor connection pools
- Set up alerts for unusual activity

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Errors**: Ensure parent records exist before creating child records
2. **Unique Constraint Violations**: Check for duplicate entries in unique fields
3. **Connection Issues**: Verify database credentials and network connectivity
4. **Performance Problems**: Check query execution plans and add indexes if needed

### Useful Queries

```sql
-- Check database size
SELECT
    table_name,
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'electionSys'
ORDER BY size_mb DESC;

-- Count records per table
SELECT
    table_name,
    table_rows
FROM information_schema.tables
WHERE table_schema = 'electionSys'
ORDER BY table_rows DESC;

-- Recent audit logs
SELECT * FROM audit_logs
ORDER BY created_at DESC
LIMIT 10;
```

## Version History

- **v1.0**: Initial database schema with core election functionality
- **v1.1**: Added proposal and commenting system
- **v1.2**: Enhanced audit logging and status management

## Contributing

When modifying the database schema:

1. Update the SQL dump file
2. Update this README with schema changes
3. Update the ERD diagram
4. Test migrations thoroughly
5. Document any breaking changes

---

**Note**: This database schema supports a complete election management system with user management, candidate registration, voting, and audit trails. Ensure proper backup procedures before making any schema changes.</content>
<parameter name="filePath">/home/cl-udio-bento-dala/Documents/REPOSITORIES/ELECTIONSYS/database/README.md