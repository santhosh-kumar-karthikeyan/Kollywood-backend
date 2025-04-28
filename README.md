# **Kollywood.io Backend**

Kollywood.io is a web-based multiplayer game inspired by table-top games. This backend powers the game, providing APIs for user authentication, game management, and matchmaking. It also includes WebSocket support for real-time gameplay.

---

## **Table of Contents**
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
  - [Authentication Routes](#authentication-routes)
  - [User Routes](#user-routes)
  - [Game Routes](#game-routes)
  - [Static Routes](#static-routes)
- [WebSocket Events](#websocket-events)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## **Features**
- User authentication with JWT.
- Real-time multiplayer game using WebSocket.
- Matchmaking system to pair players.
- Game state management with MongoDB.
- RESTful APIs for user and game data.

---

## **Technologies Used**
- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Real-Time Communication:** Socket.IO
- **Environment Management:** dotenv

---

## **APIs Used**
- **Movie database:** [The Movie Data Base (TMDB)](https://developer.themoviedb.org/reference/intro/getting-started)
- **Song database:** [Spotify Web API for developers](https://developer.spotify.com/documentation/web-api)

---

## **Setup Instructions**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/kollywood.io-backend.git
   cd kollywood.io-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/Kollywood
   JWT_SECRET_KEY=your_jwt_secret_key
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   TMDB_API_KEY=your_tmdb_api_key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

5. Access the server at `http://localhost:3000`.

---

## **API Endpoints**

### **Authentication Routes**
| Method | Endpoint         | Description                     | Request Body                                                                 |
|--------|------------------|---------------------------------|------------------------------------------------------------------------------|
| `POST` | `/auth/signup`   | Register a new user             | `{ username, email, domain, password }`                                     |
| `POST` | `/auth/login`    | Login and get a JWT token       | `{ username, password }`                                                   |
| `GET`  | `/auth/checkUsername` | Check if a username exists     | Query: `?username=<username>`                                               |

---

### **User Routes**
| Method | Endpoint         | Description                     | Request Body / Query                                                        |
|--------|------------------|---------------------------------|------------------------------------------------------------------------------|
| `GET`  | `/user/getUser`  | Get user details by username    | Query: `?username=<username>`                                               |
| `GET`  | `/user/getScore` | Get the user's total score      | Query: `?username=<username>`                                               |
| `POST` | `/user/changePassword` | Change the user's password     | `{ username, oldPass, newPass }`                                            |

---

### **Game Routes**
| Method | Endpoint             | Description                     | Request Body / Query                                                        |
|--------|----------------------|---------------------------------|------------------------------------------------------------------------------|
| `GET`  | `/game/getRoomCode`  | Get a free room to join         | None                                                                        |
| `GET`  | `/game/getMatchDetails` | Get details of a specific room | Query: `?roomCode=<roomCode>`                                               |
| `GET`  | `/game/getUserHistory` | Get a user's game history       | Query: `?username=<username>`                                               |

---

### **Static Routes**
| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| `GET`  | `/`              | Serve the home page            |
| `GET`  | `/login`         | Serve the login page           |
| `GET`  | `/signUp`        | Serve the sign-up page         |
| `GET`  | `/leaderboard`   | Serve the leaderboard page     |
| `GET`  | `/rules`         | Serve the rules page           |
| `GET`  | `/matchUp`       | Serve the matchmaking page     |

---

## **WebSocket Events**

### **Client-to-Server Events**
| Event Name     | Description                     | Payload Example                                                             |
|----------------|---------------------------------|-----------------------------------------------------------------------------|
| `createRoom`   | Create a new game room          | `{ playerName: "Player1" }`                                                |
| `joinRoom`     | Join an existing game room      | `{ playerName: "Player2", roomCode: "room123" }`                           |
| `getMovie`     | Request a movie clue            | `{ roomCode: "room123", playerName: "Player1" }`                           |
| `submitGuess`  | Submit a guess for the movie    | `{ roomCode: "room123", guess: { index: 0, value: "Inception" } }`         |
| `invalidateRoom` | Invalidate a room when a player leaves | `{ roomCode: "room123", playerName: "Player1" }`                           |

### **Server-to-Client Events**
| Event Name     | Description                     | Payload Example                                                             |
|----------------|---------------------------------|-----------------------------------------------------------------------------|
| `startGame`    | Notify players that the game has started | `{ message: "Both players have joined.", roomCode: "room123", players: ["Player1", "Player2"] }` |
| `gameStatus`   | Notify players of the game status | `{ wonBy: "Player1", lostBy: "Player2" }`                                   |

---

## **Environment Variables**

| Variable Name         | Description                              |
|-----------------------|------------------------------------------|
| `PORT`                | Port on which the server runs           |
| `MONGO_URI`           | MongoDB connection string               |
| `JWT_SECRET_KEY`      | Secret key for JWT authentication       |
| `SPOTIFY_CLIENT_ID`   | Spotify API client ID                   |
| `SPOTIFY_CLIENT_SECRET` | Spotify API client secret              |
| `TMDB_API_KEY`        | TMDB API key for fetching movie details |

---
