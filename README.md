# MediTrack Backend Services

This repository contains the **User Authentication** and **Medication Management** microservices for MediTrack. Each service runs in a separate container, communicating via Firebase for authentication and database management.

## **Services & Ports**
| Service                  | Port  | Description |
|--------------------------|-------|-------------|
| **Authentication Service** | `4000` | Handles user registration and login |
| **Medication Service**    | `6000` | Manages medication inventory and retrieval |

## **Building & Running Containers**
To build and run the services:

```sh
# Build the images
docker build . -t authentication -f Dockerfile_Authentication
docker build . -t test -f Dockerfile_MedicationTest

# Start the containers
docker run --name test -d -p 6000:6000 test
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
    "uid": "firebase-user-id"
  }
  ```

---

### **2. Medication Management**
#### **Create Medication Entry**
- **POST** `http://localhost:6000/api/medication`
- **Headers:**
  ```
  Authorization: Bearer eyJhb........
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "userId": "firebase-user-id",
    "name": "Aspirin",
    "dosage": "100mg",
    "frequency": "Twice a day"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Medication added successfully"
  }
  ```

---

### **Managing Containers**
To stop and remove running containers:
```sh
docker stop authentication test
docker rm authentication test
```


## **Notes**
- The authentication service manages **user creation and login**.
- The services requires **Firebase Admin SDK Private Key File**: `firebase-service-account.json` for secure access.
- All data is stored and managed via **Firebase Firestore**.
