# RepTrackBE - Project Structure

## Overview
This is a .NET 10 Minimal API project for tracking workout programs, exercises, and user progress.

## Project Organization

### 📁 Folders

#### `/DTO` - Data Transfer Objects
Contains all request/response models used by the API endpoints.

- **`AuthDTO.cs`** - Authentication-related DTOs
  - `LoginRequest` - Login request payload
  - `LoginResponse` - Login response with token
  - `UserDto` - User information
  
- **`WorkoutDTO.cs`** - Workout-related DTOs
  - `WorkoutCreateRequest` - Create workout request
  - `WorkoutResponse` - Workout data response
  
- **`ProgramDTO.cs`** - Program and exercise DTOs
  - `ProgramResponse` - Program information
  - `ExerciseResponse` - Exercise information
  
- **`ProgressDTO.cs`** - Progress tracking DTOs
  - `ProgressResponse` - User progress data
  - `ExerciseProgress` - Exercise-specific progress
  - `WorkoutStatsResponse` - Workout statistics

- **`LoginDTO.cs`** - Legacy login DTO (used by Controllers)
- **`LoginResponseDTO.cs`** - Legacy login response DTO (used by Controllers)

#### `/Models` - Database Models
Contains entities and database-related models.

- **`User.cs`** - User entity (Entity Framework)
- **`UserRow.cs`** - User data row (Dapper)
- **`ProgressFlatRow.cs`** - Flattened progress query result

#### `/Services` - Business Logic
Contains reusable business logic and utilities.

- **`JwtTokenGenerator.cs`** - JWT token creation and validation
- **`PasswordHasher.cs`** - Password hashing and verification using SHA256

#### `/Extensions` - Extension Methods
Contains extension methods for common operations.

- **`ClaimsPrincipalExtensions.cs`** - Extensions for extracting user information from claims

#### `/Endpoints` - API Endpoint Groups
Contains organized endpoint mappings using extension methods.

- **`AuthEndpoints.cs`** - Authentication endpoints
  - `POST /api/auth/login` - User login
  
- **`ProgramEndpoints.cs`** - Program and exercise endpoints
  - `GET /api/programs` - List all programs
  - `GET /api/exercises` - List exercises (optionally filtered by program)
  
- **`WorkoutEndpoints.cs`** - Workout logging endpoints
  - `POST /api/workouts` - Log a new workout
  - `GET /api/workouts/me` - Get user's workout history
  - `GET /api/workouts/stats` - Get user's workout statistics
  
- **`ProgressEndpoints.cs`** - Progress tracking endpoints
  - `GET /api/progress` - Get user's progress by exercise

#### `/Controllers` - MVC Controllers (Legacy)
Contains traditional MVC-style controllers (being phased out in favor of minimal APIs).

- **`AuthController.cs`** - Legacy authentication controller

#### `/Data` - Data Access
Contains database context and data access configuration.

- **`AppDbContext.cs`** - Entity Framework Core DbContext

## Technology Stack

- **.NET 10**
- **ASP.NET Core Minimal APIs** - Primary API approach
- **Dapper** - Lightweight ORM for data access
- **Entity Framework Core** - Used in legacy controllers
- **JWT Bearer Authentication** - Secure API authentication
- **SQL Server** - Database
- **Swagger/OpenAPI** - API documentation

## Configuration

Required configuration in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=...;..."
  },
  "Jwt": {
    "Key": "your-secret-key-here",
    "Issuer": "RepTrack.Api",
    "Audience": "RepTrack.Client",
    "ExpiryMinutes": "120"
  }
}
```

## Authentication

The API uses JWT Bearer tokens. To access protected endpoints:

1. Call `POST /api/auth/login` with email and password
2. Receive a JWT token in the response
3. Include the token in subsequent requests: `Authorization: Bearer <token>`

## Development Guidelines

### Adding New Endpoints

1. Create DTOs in the `/DTO` folder for request/response models
2. Create models in `/Models` if working with database entities
3. Create a new endpoint file in `/Endpoints` (e.g., `MyFeatureEndpoints.cs`)
4. Register the endpoints in `Program.cs` using `app.MapMyFeatureEndpoints()`

### Code Style

- Use **record types** for DTOs (immutable data transfer objects)
- Use **class types** for Models (database entities)
- Use **static classes** for services and extensions
- Follow existing naming conventions (snake_case for JSON properties)
- Use **raw string literals** (""") for SQL queries

### Testing Endpoints

Use Swagger UI in development mode:
- Navigate to `https://localhost:<port>/swagger`
- All endpoints are documented and testable

## Database

The application connects to SQL Server with the following main tables:
- `Users` - User accounts
- `Programs` - Workout programs
- `Exercises` - Exercises within programs
- `WorkoutLogs` - Individual workout entries
