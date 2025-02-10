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
    "uid": "firebase-user-id"
  }
  ```
  <img width="1097" alt="Screenshot 2025-02-10 at 4 35 43 PM" src="https://github.com/user-attachments/assets/b7be6885-495c-4f82-9ae0-3299f08ce82a" />


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
  <img width="1097" alt="Screenshot 2025-02-10 at 4 38 44 PM" src="https://github.com/user-attachments/assets/492299b0-c951-4c53-ac5a-1ca48005fabb" />


---

### **Managing Containers**
<img width="934" alt="image" src="https://github.com/user-attachments/assets/99ea4f0e-ca2a-40f6-b1fe-08d8fa986e96" />

To stop and remove running containers:
```sh
docker stop authentication test
docker rm authentication test
```


## **Notes**
- The authentication service manages **user creation and login**.
- The services requires **Firebase Admin SDK Private Key File**: `firebase-service-account.json` for secure access.
- All data is stored and managed via **Firebase Firestore**.
