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
  <img width="1097" alt="Screenshot 2025-02-10 at 4 34 03 PM" src="https://github.com/user-attachments/assets/d38d9c6c-ac35-45cd-920d-f13188a1b8ac" />


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
  <img width="1097" alt="Screenshot 2025-02-10 at 4 35 43 PM" src="https://github.com/user-attachments/assets/b7be6885-495c-4f82-9ae0-3299f08ce82a" />


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
  <img width="1097" alt="Screenshot 2025-02-10 at 4 38 44 PM" src="https://github.com/user-attachments/assets/492299b0-c951-4c53-ac5a-1ca48005fabb" />


### **Managing Containers**
<img width="934" alt="image" src="https://github.com/user-attachments/assets/99ea4f0e-ca2a-40f6-b1fe-08d8fa986e96" />

To stop and remove running containers:
```sh
docker stop authentication
docker rm authentication
```


## **Notes**
- The authentication service manages **user creation and login**.
- The services requires **Firebase Admin SDK Private Key File**: `firebase-service-account.json` for secure access.
- All data is stored and managed via **Firebase Firestore**.
