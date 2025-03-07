# API Documentation

## Trainer Service

### Base URL
`http://localhost:8000/api/entrenadores`

### JSON Format
- **External API Response**:
  ```json
  {
    "entrenadores": [
      {
        "id": 1,
        "nombre": "Ash Ketchum",
        "edad": 10,
        "sexo": "Masculino"
      },
      {
        "id": 2,
        "nombre": "Misty",
        "edad": 12,
        "sexo": "Femenino"
      },
      {
        "id": 3,
        "nombre": "Brock",
        "edad": 15,
        "sexo": "Masculino"
      },
      {
        "id": 4,
        "nombre": "Red",
        "edad": 16,
        "sexo": "Masculino"
      },
      {
        "id": 5,
        "nombre": "Blue",
        "edad": 17,
        "sexo": "Femenino"
      }
    ]
  }
  ```
- **Service Response**:
  ```json
  {
    "id": 1,
    "nombre": "Ash Ketchum",
    "edad": 10,
    "sexo": "Masculino"
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
- **External API Response**:
  ```json
  {
    "pokemon": [
      {
        "id": 1,
        "nombre": "Bulbasaur",
        "tipo": "Planta",
        "descripcion": "Pokemon de tipo planta"
      },
      {
        "id": 2,
        "nombre": "Pikachu",
        "tipo": "Eléctrico"
      },
      {
        "id": 3,
        "nombre": "Charmander",
        "tipo": "Fuego"
      },
      {
        "id": 4,
        "nombre": "Squirtle",
        "tipo": "Agua"
      },
      {
        "id": 5,
        "nombre": "Eevee",
        "tipo": "Normal"
      }
    ]
  }
  ```
- **External API Response**:
  ```json
  {
    "id": 1,
    "nombre": "Bulbasaur",
    "tipo": "Planta",
    "descripcion": "Pokemon de tipo planta"
  }
  ```
- **Service Response**:
  ```json
  {
    "id": 1,
    "nombre": "Bulbasaur",
    "tipo": "Planta",
    "descripcion": "Pokemon de tipo planta"
  }
  ```
- **External API Response**:
  ```json
  {
    "id": 1,
    "nombre": "Pikachu",
    "tipo": "Eléctrico"
  }
  ```
- **Service Response**:
  ```json
  {
    "id": 1,
    "nombre": "Pikachu",
    "tipo": "Eléctrico"
  }
  ```
- **External API Response**:
  ```json
  {
    "pokemones": [
      {
        "id": 25,
        "nombre": "Pikachu",
        "tipos": [
          "Eléctrico"
        ],
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
      },
      {
        "id": 6,
        "nombre": "Charizard",
        "tipos": [
          "Fuego",
          "Volador"
        ],
        "nivel": 50,
        "estadisticas": {
          "hp": 100,
          "ataque": 120,
          "defensa": 70,
          "ataque_especial": 140,
          "defensa_especial": 100,
          "velocidad": 115
        },
        "movimientos": [
          "Lanzallamas",
          "Vuelo",
          "Garra Dragón",
          "Onda Ígnea"
        ],
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"
      }
    ]
  }
  ```
- **Service Response**:
  ```json
  {
    "id": 25,
    "nombre": "Pikachu",
    "tipos": [
      "Eléctrico"
    ],
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
  Get a specific pokemon.

## Teams Service

### Base URL
`http://localhost:8000/equipos`

### Endpoints
- **GET /**  
  List all trainers with teams.
- **POST /:entrenadorId**  
  Create a team for the specified trainer.
  - **Request Body**:
    ```json
    {
      "name": "Team Name",
      "pokemonIds": [1, 2, 3]
    }
    ```
- **GET /:entrenadorId**  
  Get all teams for the specified trainer.
- **GET /:entrenadorId/:equipoId**  
  Get a specific team for the specified trainer.
- **PUT /:entrenadorId/:equipoId**  
  Update the specified team for the specified trainer.
  - **Request Body**:
    ```json
    {
      "name": "Updated Team Name",
      "pokemonIds": [1, 2, 4]
    }
    ```
- **DELETE /:entrenadorId/:equipoId**  
  Delete the specified team for the specified trainer.

---

This documentation outlines the services and their endpoints for the application. Please refer to this file for guidance on how to use the API effectively.
