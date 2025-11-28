# Database Schema

## Collections

### Users

Stores user account information.

| Field       | Type     | Description                   |
| :---------- | :------- | :---------------------------- |
| `_id`       | ObjectId | Unique identifier             |
| `email`     | String   | User's email address (unique) |
| `password`  | String   | Hashed password               |
| `name`      | String   | User's full name              |
| `googleId`  | String   | Google OAuth ID (optional)    |
| `createdAt` | Date     | Creation timestamp            |

### Resumes

Stores user resumes.

| Field       | Type     | Description                                              |
| :---------- | :------- | :------------------------------------------------------- |
| `_id`       | ObjectId | Unique identifier                                        |
| `userId`    | ObjectId | Reference to User                                        |
| `title`     | String   | Resume title                                             |
| `content`   | Object   | Structured resume data (personal info, experience, etc.) |
| `createdAt` | Date     | Creation timestamp                                       |
| `updatedAt` | Date     | Last update timestamp                                    |

### Jobs

Stores job descriptions for analysis.

| Field         | Type     | Description          |
| :------------ | :------- | :------------------- |
| `_id`         | ObjectId | Unique identifier    |
| `userId`      | ObjectId | Reference to User    |
| `title`       | String   | Job title            |
| `company`     | String   | Company name         |
| `description` | String   | Full job description |
| `location`    | String   | Job location         |
| `createdAt`   | Date     | Creation timestamp   |
