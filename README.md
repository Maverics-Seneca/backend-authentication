# MediTrack Backend Services

This repository contains the **User Authentication** microservice for MediTrack. Each service runs in a separate container, communicating via Firebase for authentication and database management.

## **Services & Ports**
| Service                  | Port  | Description |
|--------------------------|-------|-------------|
| **Authentication Service** | `4000` | Handles user registration and login |

## **Building & Running Containers**
To build and run the services:

```sh
# Build the images
docker build . -t authentication -f Dockerfile_Authentication

# Start the containers
docker run --name authentication -d -p 4000:4000 authentication
```

## **API Endpoints & Testing**
### **1. User Authentication**
#### **Register a New User**
- **POST** `http://localhost:4000/api/register`
- **Body:**
  ```json
  {
    "email": "testuser@example.com",
    "password": "SecurePass123",
    "name": "John Doe",
    "role": "caregiver"
  }
  ```

#### **Login**
- **POST** `http://localhost:4000/api/login`
- **Body:**
  ```json
  {
    "email": "testuser@example.com",
    "password": "SecurePass123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cC...",
    "userId": "firebase-user-id",
    "role": "caregiver"
  }
  ```

#### **Get User Details**
- **GET** `http://localhost:4000/api/user`
- **Header:**
  ```json
  {
    "Authorization": "Bearer <JWT Token>"
  }
  ```
- **Response:**
  ```json
  {
    "email": "testuser@example.com",
    "name": "John Doe",
    "role": "caregiver",
    "createdAt": {
        "_seconds": 1740003882,
        "_nanoseconds": 963000000
    }
  }
  ```

### **Managing Containers**
To stop and remove running containers:
```sh
docker stop authentication
docker rm authentication
```


## **Notes**
- The authentication service manages **user creation and login**.
- The services requires **Firebase Admin SDK Private Key File**: `firebase-service-account.json` for secure access.
- All data is stored and managed via **Firebase Firestore**.
