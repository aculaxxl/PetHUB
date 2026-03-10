# PetHub 

PetHub is a specialized social network designed for pet owners. Unlike traditional platforms, PetHub allows users to create profiles for their pets and publish news, stories, and updates specifically from the pet's perspective.

## **Key Features**

*   **Pet-Centric Social Networking**: Create and manage unique profiles for your pets, posting updates and stories from their perspective.
*   **Smart Adoption System**: A multi-step workflow for pet adoption. Contact information (phone numbers) remains hidden until the owner officially approves the adoption request.
*   **Ownership Transfer**: Secure digital handover of pet profiles from one user to another, maintaining the pet's history and data.
*   **Phone-Based Auth (SMS Mimic)**: Custom authentication system using phone numbers and verification codes (logged to terminal for development) via **SimpleJWT**.
*   **News Feed**: Interactive feed for pet stories, news, and community updates.

##  Tech Stack

### Backend
- **Python 3.12** / **Django 5.x**
- **Django REST Framework (DRF)**
- **SimpleJWT** (Authentication)
- **drf-spectacular** (Swagger/OpenAPI documentation)
- **SQLite** (Development database)

### Frontend
- **React 18** (Vite-powered)
- **React Router Dom v6** (Navigation)
- **Axios/Fetch** (Custom API wrapper with 401-interceptors)
- **CSS3** (Responsive custom styling)

### Infrastructure
- **Docker & Docker Compose** (Containerization)

## Installation & Setup

### Prerequisites
- Docker & Docker Compose

### Running with Docker
1. Clone the repository:
   ```bash```
   git clone https://github.com/aculaxxl/PetHUB
   cd mynewproject
2. Start the application:
    ```bash```
    docker-compose up --build
3. Initialize the database (run in a new terminal):
### 🔗 Access the Services

- **Frontend (Web App):** [http://localhost:5173](http://localhost:5173) — *The main user interface.*
- **API Documentation (Swagger):** [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/) — *Interactive portal to explore and test all API endpoints.*

> **Note:** The backend API root is located at `http://localhost:8000/api/`. Use the Swagger UI above to interact with specific resources like `/news/` or `/profile/`.

Project author:
Yelyzaveta Novitska
