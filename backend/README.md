# Election System Backend

## Description

This is the backend of the Election System, a web application for managing elections, candidates, voting, and electoral participation. The system allows administrators to create electoral themes, elections, and manage candidates, while voters can register, vote, and follow the electoral process.

The backend is built with a clean layered architecture (Controllers, Services, Repositories), following good development practices.

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **MongoDB** - NoSQL database (for profiles and preferences)
- **Passport.js** - Authentication
- **bcrypt** - Password hashing
- **Joi** - Data validation
- **express-session** - Session management
- **connect-mongo** - Session storage in MongoDB

## Prerequisites

Before starting, make sure you have installed:

- Node.js (version 16 or higher)
- MySQL (version 8.0 or higher)
- MongoDB (version 4.0 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <https://github.com/claudiobentodaladev/ELECTIONSYS/>
cd ELECTIONSYS/backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (see configuration section)

4. Run the database initialization script:

```bash
# Execute the SQL dump located in database/dump/electionSys.sql
mysql -u <username> -p <database_name> < database/dump/electionSys.sql
```

## Configuration

### Environment Variables

Create a `.env` file in the backend root directory with the following variables:

```env
# Server port
PORT=5000

# MySQL Database
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=election_system

# MongoDB
MONGODB_URI=mongodb://localhost:27017/election_system

# Session
SESSION_SECRET=your_session_secret_key

# Other configurations
NODE_ENV=development
```

### Database

#### MySQL

The system uses MySQL for relational data. Execute the SQL script in `database/dump/electionSys.sql` to create the necessary tables.

#### MongoDB

Used for user profile and preferences data. Collections are created automatically.

## Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on the port defined in `PORT` (default: 5000).

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # API controllers
│   ├── services/            # Business logic
│   ├── repositories/        # Data access
│   ├── routes/              # Route definitions
│   │   ├── auth/
│   │   ├── candidates/
│   │   ├── elections/
│   │   ├── participation/
│   │   ├── vote/
│   │   ├── profile/
│   │   ├── preferences/
│   │   ├── notifications/
│   │   ├── dashboard/
│   │   └── theme/
│   ├── middleware/          # Custom middlewares
│   ├── database/            # Database connections
│   │   ├── mysql/
│   │   └── mongodb/
│   ├── utils/               # Utilities
│   ├── validator/           # Validation schemas
│   └── index.mjs            # Entry point
├── database/
│   └── dump/
│       └── electionSys.sql  # MySQL initialization script
├── package.json
└── README.md
```

## API Endpoints

### Authentication

#### POST /api/auth/signup

Registers a new user.

**Headers:**

- Content-Type: application/json

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "claudiodala17",
  "name": "claudio",
  "surname": "bento dala",
  "sex": "M",
  "born_date": "2009-04-23"
}
```

**Response (201 - Success):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user_id": 1
  }
}
```

**Response (400 - Validation Error):**

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [...]
}
```

#### POST /api/auth/login

Logs in the user.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 - Success):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "eleitor"
    }
  }
}
```

#### POST /api/auth/logout

Logs out the user.

**Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET /api/auth/status

Checks authentication status.

**Response (200 - Authenticated):**

```json
{
  "success": true,
  "isAuthenticated": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "eleitor"
  }
}
```

**Response (200 - Not Authenticated):**

```json
{
  "success": false,
  "isAuthenticated": false,
  "message": "not authenticated"
}
```

### Themes

#### POST /api/theme

Creates a new electoral theme (admin only).

**Headers:**

- Cookie: connect.sid=<session_id>

**Body:**

```json
{
  "name": "school association",
  "description": "school association Elections"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Theme created",
  "data": {
    "theme_id": 1
  }
}
```

#### GET /api/theme

Lists admin user's themes.

**Response (200):**

```json
{
  "success": true,
  "message": "Themes retrieved",
  "data": [
    {
      "id": 1,
      "name": "school association",
      "description": "school association Elections",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Elections

#### POST /api/election

Creates a new election (admin only).

**Body:**

```json
{
  "theme_id": 1,
  "title": "Mayor of São Paulo",
  "description": "Election for mayor",
  "start_date": "2024-10-01T00:00:00.000Z",
  "end_date": "2024-10-31T23:59:59.000Z",
  "candidacy_deadline": "2024-09-30T23:59:59.000Z",
  "voting_deadline": "2024-10-31T23:59:59.000Z"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Election created",
  "data": {
    "election_id": 1
  }
}
```

#### GET /api/election

Lists admin user's elections.

**Response (200):**

```json
{
  "success": true,
  "message": "Elections retrieved",
  "data": [...]
}
```

#### GET /api/election/:id

Gets details of a specific election.

**Response (200):**

```json
{
  "success": true,
  "message": "Election retrieved",
  "data": {
    "id": 1,
    "title": "Mayor of São Paulo",
    "status": "ongoing",
    ...
  }
}
```

#### PATCH /api/election/:id

Updates an election (admin only).

**Body:**

```json
{
  "title": "New title",
  "description": "New description"
}
```

### Participation

#### POST /api/participation/:election_id

Registers participation in an election.

**Response (201):**

```json
{
  "success": true,
  "message": "Participation created",
  "data": {
    "participation_id": 1
  }
}
```

#### GET /api/participation/:election_id

Lists participations in an election (admin) or user's participation (voter).

#### PATCH /api/participation/review/:participation_id

Reviews participation (admin only).

**Body:**

```json
{
  "status": "eligible"
}
```

### Candidates

#### POST /api/candidates/:election_id

Creates a candidacy.

**Body:**

```json
{
  "logo_group_url": "https://example.com/logo.png",
  "group_name": "Party X",
  "description": "Candidacy for mayor"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Candidate created",
  "data": {
    "candidate_id": 1
  }
}
```

#### GET /api/candidates/:election_id

Lists candidates for an election.

**Response (200):**

```json
{
  "success": true,
  "message": "Candidates retrieved",
  "data": [...]
}
```

#### PATCH /api/candidates/edit/:candidate_id

Edits own candidacy.

**Body:**

```json
{
  "group_name": "New name",
  "description": "New description"
}
```

#### PATCH /api/candidates/:candidate_id

Reviews candidacy (admin only).

**Body:**

```json
{
  "status_candidate": "eligible"
}
```

### Voting

#### POST /api/vote/:candidate_id

Votes for a candidate.

**Response (201):**

```json
{
  "success": true,
  "message": "Vote created",
  "data": {
    "vote_id": 1
  }
}
```

#### GET /api/vote/:election_id

Gets votes for an election.

### Profile

#### GET /api/profile

Gets user profile.

**Response (200):**

```json
{
  "success": true,
  "message": "User data",
  "data": {
    "user": {
      "email": "user@example.com",
      "role": "eleitor"
    },
    "profile": {
      "username": "johndoe",
      "name": "John Doe",
      ...
    }
  }
}
```

#### PATCH /api/profile

Updates user profile.

**Body:**

```json
{
  "username": "newusername",
  "name": "New Name"
}
```

### Preferences

#### PATCH /api/preferences/theme

Toggles theme (light/dark).

**Response (200):**

```json
{
  "success": true,
  "message": "Theme switched",
  "data": {
    "user_id": 1,
    "theme": "DARK"
  }
}
```

### Notifications

#### GET /api/notifications

Gets user notifications.

**Response (200):**

```json
{
  "success": true,
  "message": "Notifications retrieved",
  "data": [...]
}
```

### Dashboard

#### GET /api/dashboard

Gets dashboard statistics (admin only).

**Response (200):**

```json
{
  "success": true,
  "message": "Dashboard stats retrieved",
  "data": {
    "themes": 2,
    "elections": 5,
    "participations": 150
  }
}
```

## Database

### MySQL Tables

- `users` - System users
- `themes` - Electoral themes
- `elections` - Elections
- `participation` - User participation in elections
- `candidates` - Candidacies
- `vote` - Votes
- `audit_log` - Audit log

### MongoDB Collections

- `profiles` - User profiles
- `preferences` - User preferences

## Authentication and Authorization

The system uses sessions for authentication. There are two types of users:

- **Admin**: Can create themes, elections, manage candidates and participations
- **Eleitor (Voter)**: Can register for elections, create candidacies, and vote

### Middlewares

- `isAuthenticated`: Checks if user is logged in
- `isAdmin`: Checks if user is admin
- `isEleitor`: Checks if user is voter
- `autoUpdateElectionStatus`: Automatically updates election status

## Testing

```bash
npm test
```

## Available Scripts

- `npm start` - Starts the server in production
- `npm run dev` - Starts the server in development with nodemon
- `npm test` - Runs tests
- `npm run lint` - Runs the linter

## Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Support

For questions or issues, open an issue in the repository or contact the development team.

---

**Note**: This README was generated for the Election System backend. Make sure to follow security best practices and keep dependencies updated.
