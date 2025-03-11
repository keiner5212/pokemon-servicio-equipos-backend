# API Documentation

## Trainer Service

### Base URL
`https://run.mocky.io/v3/a7337c0c-7292-45c9-8e23-083fd9222b8e`

### JSON Format
- **External API Response**:
  ```json
  {
    "trainers": [
      {
        "id": "1",
        "birth_date": "1990-01-01",
        "email": "ash.ketchum@example.com",
        "first_name": "Ash",
        "last_name": "Ketchum"
      }
    ]
  }
  ```
- **Service Response**:
  ```json
  {
    "id": "1",
    "birth_date": "1990-01-01",
    "email": "ash.ketchum@example.com",
    "first_name": "Ash",
    "last_name": "Ketchum"
  }
  ```

### Endpoints
- **GET /**  
  List all trainers.

- **GET /:id**  
  Get a specific trainer. (ID must be a number)

## Pokemon Service

### Base URL
`http://localhost:8000/api/pokemon`

### JSON Format
- **Service Response**:
  ```json
  {
    "id": 25,
    "nombre": "Pikachu",
    "tipos": ["Eléctrico"],
    "nivel": 35,
    "estadisticas": {
      "hp": 80,
      "ataque": 90,
      "defensa": 50,
      "ataque_especial": 85,
      "defensa_especial": 60,
      "velocidad": 110
    },
    "movimientos": [
      "Impactrueno",
      "Rayo",
      "Ataque Rápido",
      "Onda Trueno"
    ],
    "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  }
  ```

### Endpoints
- **GET /:id**  
  Get a specific pokemon by ID.

## Teams Service

### Base URL
`http://localhost:8000/equipos`

### JSON Format
- **Create/Update Team Request**:
  ```json
  {
    "nombre": "Equipo Principal",
    "pokemonIds": [1, 2, 3]
  }
  ```

- **Team Response**:
  ```json
  {
    "entrenador": {
      "id": "1",
      "birth_date": "1990-01-01",
      "email": "ash.ketchum@example.com",
      "first_name": "Ash",
      "last_name": "Ketchum"
    },
    "equipo": {
      "id": 1,
      "nombre": "Equipo Principal",
      "pokemones": [
        {
          "id": 25,
          "nombre": "Pikachu",
          "tipos": ["Eléctrico"],
          "nivel": 35
        }
      ]
    }
  }
  ```

### Endpoints
- **GET /**  
  List all trainers with their teams.

- **POST /:entrenadorId**  
  Create a new team for a trainer.  
  Body: `{ nombre: string, pokemonIds: number[] }`  
  Rules:
  - Maximum 6 pokemon per team
  - Trainer must exist

- **GET /:entrenadorId**  
  Get all teams for a specific trainer.

- **GET /:entrenadorId/:equipoId**  
  Get a specific team from a trainer.

- **PUT /:entrenadorId/:equipoId**  
  Update a specific team.  
  Body: `{ nombre: string, pokemonIds: number[] }`  
  Rules:
  - Maximum 6 pokemon per team
  - Trainer and team must exist

- **DELETE /:entrenadorId/:equipoId**  
  Delete a specific team.

- **DELETE /:entrenadorId/:equipoId/:pokemonId**  
  Remove a specific pokemon from a team.  
  Rules:
  - Cannot remove the last pokemon from a team
  - Pokemon must exist in the team
  - Trainer and team must exist
  
  Response:
  ```json
  {
    "entrenador": {
      "id": "1",
      "birth_date": "1990-01-01",
      "email": "ash.ketchum@example.com",
      "first_name": "Ash",
      "last_name": "Ketchum"
    },
    "equipo": {
      "id": 1,
      "nombre": "Equipo Principal",
      "pokemones": [/* Lista de pokémon restantes */]
    }
  }
  ```

---

This documentation outlines the services and their endpoints for the application. Please refer to this file for guidance on how to use the API effectively.
