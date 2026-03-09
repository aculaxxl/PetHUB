# PetHub 

PetHub is a specialized social network designed for pet owners. Unlike traditional platforms, PetHub allows users to create profiles for their pets and publish news, stories, and updates specifically from the pet's perspective.

##  Key Features

- **Unique Authentication:** Phone-number-based login with terminal-generated verification codes (OTP logic).
- **Pet-Centric Social Feed:** Users post news on behalf of their pets, featuring pet avatars and names in the feed.
- **Secure Architecture:** Full JWT-based authentication with automated **Access/Refresh token** rotation logic on the frontend.
- **Profile Management:** Comprehensive management for user profiles and multiple pet profiles per user.
- **Role-Based Access Control:** Strict object-level permissions ensuring only owners can edit or delete their pet's content.
- **Modern API Documentation:** Automated API schema generation using **Swagger/OpenAPI**.

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
    docker-compose exec backend python manage.py migrate
4. Access the services:
    Frontend: http://localhost:5173
    Backend API: http://localhost:8000/api/
    Swagger UI: http://localhost:8000/api/docs/

Author
Developed by Yelyzaveta Novitska 