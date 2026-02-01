# Election System

## Overview

The Election System is a comprehensive web application designed to manage electoral processes, including user authentication, election creation, candidate management, voting, and result tracking. The system supports role-based access with administrators and voters, ensuring secure and transparent elections.

### Key Features

- **User Management**: Registration, authentication, and profile management with role-based permissions
- **Election Management**: Create, edit, and monitor elections with customizable themes and settings
- **Candidate System**: Propose, review, and manage candidates with commentary features
- **Voting System**: Secure voting with participation tracking and result aggregation
- **Dashboard**: Real-time analytics and election status monitoring
- **Notifications**: Automated notifications for election updates and important events
- **Preferences**: User-customizable themes and system preferences

## Architecture

The system follows a layered architecture:

- **Frontend**: Web interface for user interaction (not included in this repository)
- **Backend**: Node.js/Express API server handling business logic and data processing
- **Database**: Hybrid database approach using MySQL for relational data and MongoDB for flexible user preferences

### Components

- **Backend Service**: RESTful API built with Express.js, featuring authentication, validation, and comprehensive error handling
- **Database Layer**: MySQL for structured election data and MongoDB for user profiles and preferences
- **Middleware**: Authentication, authorization, validation, and automated election status updates

## Technologies

- **Backend**: Node.js, Express.js, Passport.js for authentication
- **Databases**: MySQL 8.0+, MongoDB 4.0+
- **Security**: bcrypt for password hashing, express-session for session management
- **Validation**: Joi for input validation
- **Development**: ESLint for code quality, npm for dependency management

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

   ```bash
   git clone <https://github.com/claudiobentodaladev/ELECTIONSYS>
   cd ELECTIONSYS
   ```

2. Set up the backend:
   - Navigate to the `backend/` directory
   - Follow the detailed setup instructions in [backend/README.md](backend/README.md)

3. Set up the database:
   - Navigate to the `database/` directory
   - Follow the detailed setup instructions in [database/README.md](database/README.md)

## Usage

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. The API will be available at `http://localhost:5000`

3. Refer to [backend/README.md](backend/README.md) for complete API documentation and usage examples

## Project Structure

```
ELECTIONSYS/
├── backend/           # Node.js/Express API server
│   ├── src/          # Source code
│   ├── package.json  # Dependencies and scripts
│   └── README.md     # Backend documentation
├── database/         # Database schemas and setup
│   ├── dump/         # MySQL database dump
│   ├── EER/          # Entity-Relationship diagrams
│   └── README.md     # Database documentation
└── README.md         # This file
```

## Development

### Environment Setup

- Ensure all prerequisites are installed
- Configure environment variables as described in the backend README
- Set up database connections for both MySQL and MongoDB

### Testing

- Run the backend server and test API endpoints
- Use tools like Postman or curl for API testing
- Refer to backend README for detailed testing procedures

### Deployment

The system is designed for deployment on standard web hosting platforms supporting Node.js, MySQL, and MongoDB. Ensure proper environment configuration for production use.

## Security Considerations

- Passwords are hashed using bcrypt
- Session-based authentication with secure cookies
- Input validation on all endpoints
- Role-based access control
- SQL injection prevention through parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the existing code style
4. Test thoroughly
5. Submit a pull request

Please refer to the backend and database READMEs for specific contribution guidelines related to those components.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:

- Check the backend and database READMEs for troubleshooting
- Review the API documentation for endpoint usage
- Ensure all prerequisites are properly configured

## Changelog

### Version 1.0.0

- Initial release with complete election management system
- User authentication and authorization
- Election creation and management
- Candidate proposal and review system
- Voting functionality with result tracking
- Dashboard with analytics
- Notification system
- Theme and preference customization
