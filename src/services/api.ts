/**
 * API Service
 * 
 * This file contains mock API functions that would connect to a real backend.
 * Replace these with actual API calls when you have a backend server running.
 * 
 * Note: Parameters prefixed with _ are intentionally unused in mock implementations
 */

import type { User, Exercise, Workout, ProgressData } from '../types';

// Update this with your actual API URL when you have a backend
// const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Authentication APIs
 */

export const authAPI = {
    /**
     * Login user
     * @param email - User email
     * @param password - User password (unused in mock implementation)
     * @returns User object if successful
     */
    login: async (email: string, _password: string): Promise<User | null> => {
        // TODO: Replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/auth/login`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password })
        // });
        // const data = await response.json();
        // return data.user;

        // Mock implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    user_id: 1,
                    email: email,
                    name: 'David'
                });
            }, 500);
        });
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        // TODO: Replace with actual API call
        // await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });

        // Mock implementation
        return Promise.resolve();
    },

    /**
     * Register new user
     */
    register: async (_email: string, _password: string, _name: string): Promise<User | null> => {
        // TODO: Implement registration API call
        return null;
    }
};

/**
 * Exercise APIs
 */

export const exerciseAPI = {
    /**
     * Get exercises for a program
     * @param programId - Program ID (1=Push, 2=Pull, 3=Legs)
     * @returns Array of exercises
     */
    getExercisesByProgram: async (programId: number): Promise<Exercise[]> => {
        // TODO: Replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/exercises?program_id=${programId}`);
        // return await response.json();

        // Mock implementation
        const mockExercises: Record<number, Exercise[]> = {
            1: [
                { exercise_id: 1, exercise_name: 'Bench Press', program_id: 1 },
                { exercise_id: 2, exercise_name: 'Machine Flyes', program_id: 1 },
                { exercise_id: 3, exercise_name: 'Incline Bench Press', program_id: 1 },
                { exercise_id: 4, exercise_name: 'Dumbbell Flyes', program_id: 1 },
                { exercise_id: 5, exercise_name: 'Tricep Pushdowns', program_id: 1 },
                { exercise_id: 6, exercise_name: 'Overhead Press', program_id: 1 },
            ],
            2: [
                { exercise_id: 7, exercise_name: 'T-Bar Row', program_id: 2 },
                { exercise_id: 8, exercise_name: 'Lat Pulldown', program_id: 2 },
                { exercise_id: 9, exercise_name: 'Cable Row', program_id: 2 },
                { exercise_id: 10, exercise_name: 'Face Pulls', program_id: 2 },
                { exercise_id: 11, exercise_name: 'Bicep Curls', program_id: 2 },
                { exercise_id: 12, exercise_name: 'Hammer Curls', program_id: 2 },
            ],
            3: [
                { exercise_id: 13, exercise_name: 'Barbell Squats', program_id: 3 },
                { exercise_id: 14, exercise_name: 'Leg Press', program_id: 3 },
                { exercise_id: 15, exercise_name: 'Romanian Deadlift', program_id: 3 },
                { exercise_id: 16, exercise_name: 'Leg Extension', program_id: 3 },
                { exercise_id: 17, exercise_name: 'Leg Curl', program_id: 3 },
                { exercise_id: 18, exercise_name: 'Calf Raises', program_id: 3 },
            ],
        };

        return Promise.resolve(mockExercises[programId] || []);
    },

    /**
     * Get all exercises
     */
    getAllExercises: async (): Promise<Exercise[]> => {
        // TODO: Implement API call
        return [];
    }
};

/**
 * Workout APIs
 */

export const workoutAPI = {
    /**
     * Log a workout
     * @param workout - Workout data
     * @returns Created workout with ID
     */
    logWorkout: async (workout: Omit<Workout, 'workout_id'>): Promise<Workout> => {
        // TODO: Replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/workouts`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(workout)
        // });
        // return await response.json();

        // Mock implementation
        return Promise.resolve({
            ...workout,
            workout_id: Math.floor(Math.random() * 1000),
            date: new Date().toISOString()
        });
    },

    /**
     * Get user's workout history
     * @param userId - User ID
     */
    getUserWorkouts: async (_userId: number): Promise<Workout[]> => {
        // TODO: Implement API call
        return [];
    },

    /**
     * Get latest workout
     * @param userId - User ID
     */
    getLatestWorkout: async (_userId: number): Promise<Workout | null> => {
        // TODO: Implement API call
        return null;
    },

    /**
     * Get total workout count
     * @param userId - User ID
     */
    getTotalWorkoutCount: async (_userId: number): Promise<number> => {
        // TODO: Implement API call
        // Mock implementation
        return Promise.resolve(12);
    }
};

/**
 * Progress APIs
 */

export const progressAPI = {
    /**
     * Get user's progress data
     * @param userId - User ID (unused in mock implementation)
     * @returns Progress data grouped by program
     */
    getUserProgress: async (_userId: number): Promise<ProgressData[]> => {
        // TODO: Replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/progress/${userId}`);
        // return await response.json();

        // Mock implementation
        return Promise.resolve([
            {
                program_name: 'Push',
                exercises: [
                    { exercise_name: 'Bench Press', weight: 100, reps: 5 },
                    { exercise_name: 'Machine Flyes', weight: 100, reps: 5 },
                    { exercise_name: 'Incline Bench Press', weight: 100, reps: 5 },
                    { exercise_name: 'Dumbbell Flyes', weight: 100, reps: 5 },
                ],
            },
            {
                program_name: 'Pull',
                exercises: [
                    { exercise_name: 'T-Bar Row', weight: 100, reps: 5 },
                    { exercise_name: 'Lat Pulldown', weight: 100, reps: 5 },
                ],
            },
            {
                program_name: 'Legs',
                exercises: [
                    { exercise_name: 'Barbell Squats', weight: 100, reps: 5 },
                    { exercise_name: 'Leg Press', weight: 100, reps: 5 },
                ],
            },
        ]);
    }
};

/**
 * Example Backend API Structure (Node.js/Express)
 * 
 * You would need to create these endpoints:
 * 
 * POST   /api/auth/login           - User login
 * POST   /api/auth/logout          - User logout
 * POST   /api/auth/register        - User registration
 * 
 * GET    /api/exercises            - Get all exercises
 * GET    /api/exercises?program_id={id} - Get exercises by program
 * POST   /api/exercises            - Create new exercise
 * 
 * GET    /api/workouts             - Get all workouts for user
 * POST   /api/workouts             - Log a new workout
 * GET    /api/workouts/:id         - Get specific workout
 * DELETE /api/workouts/:id         - Delete a workout
 * 
 * GET    /api/progress/:userId     - Get user's progress data
 * 
 * GET    /api/programs             - Get all programs
 */

export default {
    auth: authAPI,
    exercises: exerciseAPI,
    workouts: workoutAPI,
    progress: progressAPI
};
