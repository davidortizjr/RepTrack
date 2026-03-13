# Custom Workout API Integration Guide

## Backend Endpoints Created

### 1. **POST /api/custom-workouts** - Save Custom Workout
Creates a new custom workout program for the authenticated user.

**Request Body:**
```typescript
{
  name: string,        // Workout name (e.g., "Friday Burn")
  exerciseIds: number[] // Array of exercise IDs in order
}
```

**Response:**
```json
{
  "program_id": 123,
  "message": "Custom workout saved successfully"
}
```

**Status Codes:**
- `200 OK` - Workout saved successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not authenticated

---

### 2. **GET /api/custom-workouts/me** - Get User's Custom Workouts
Retrieves all custom workouts created by the authenticated user.

**Response:**
```json
[
  {
    "program_id": 123,
    "program_name": "Friday Burn",
    "exercise_count": 5
  }
]
```

---

### 3. **GET /api/custom-workouts/{programId}** - Get Custom Workout Details
Retrieves details of a specific custom workout.

**Response:**
```json
{
  "program_id": 123,
  "name": "Friday Burn",
  "user_id": 1,
  "exercise_ids": [10, 5, 8, 12, 3]
}
```

**Status Codes:**
- `200 OK` - Workout found
- `404 Not Found` - Workout doesn't exist or not owned by user

---

### 4. **DELETE /api/custom-workouts/{programId}** - Delete Custom Workout
Deletes a custom workout (only if owned by the authenticated user).

**Response:**
```json
{
  "message": "Custom workout deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Deleted successfully
- `404 Not Found` - Workout doesn't exist or not owned by user

---

## Frontend API Service

Add this to your `api.ts`:

```typescript
export const workoutAPI = {
  // ... existing methods ...

  saveCustomWorkout: async (data: { name: string; exerciseIds: number[] }) => {
    const response = await fetch(`${BASE_URL}/custom-workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        name: data.name,
        exerciseIds: data.exerciseIds
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save custom workout');
    }
    
    return response.json();
  },

  getMyCustomWorkouts: async () => {
    const response = await fetch(`${BASE_URL}/custom-workouts/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch custom workouts');
    }
    
    return response.json();
  },

  getCustomWorkout: async (programId: number) => {
    const response = await fetch(`${BASE_URL}/custom-workouts/${programId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch custom workout');
    }
    
    return response.json();
  },

  deleteCustomWorkout: async (programId: number) => {
    const response = await fetch(`${BASE_URL}/custom-workouts/${programId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete custom workout');
    }
    
    return response.json();
  }
};
```

---

## Database Migration Required

Run this SQL script on your database:

```sql
-- See: RepTrackBE\Database\Migration_CustomWorkouts.sql
```

This creates:
1. **ProgramExercises** table - Junction table linking programs to exercises with ordering
2. **UserId** column in Programs table (if it doesn't exist)

---

## How It Works

1. **User creates custom workout** in your React component
2. **Frontend sends** `name` and `exerciseIds` array to `POST /api/custom-workouts`
3. **Backend**:
   - Creates new row in `Programs` table with user's ID
   - Creates rows in `ProgramExercises` linking each exercise to the program with order
4. **User can view** their custom workouts with `GET /api/custom-workouts/me`
5. **User can use** the custom workout like any other program

---

## Integration with Your Component

Your existing code already has the correct structure! Just make sure your `api.ts` has the methods above and the frontend will work perfectly:

```typescript
// This already works in your component:
await workoutAPI.saveCustomWorkout({
    name: trimmedName,
    exerciseIds: orderedExerciseIds,
});
```

✅ Backend is ready to receive this!
