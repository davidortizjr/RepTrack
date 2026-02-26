import type { User, Exercise, Workout, ProgressData } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5275/api';
const AUTH_TOKEN_KEY = 'auth_token';

type LoginApiResponse = {
    token?: string;
    Token?: string;
    user?: {
        userId?: number;
        UserId?: number;
        user_id?: number;
        email: string;
        Email?: string;
        name?: string;
        Name?: string;
    };
    User?: {
        userId?: number;
        UserId?: number;
        user_id?: number;
        email?: string;
        Email?: string;
        name?: string;
        Name?: string;
    };
};

type LoginApiUser = {
    userId?: number;
    UserId?: number;
    user_id?: number;
    email?: string;
    Email?: string;
    name?: string;
    Name?: string;
};

const getAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        return;
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
};

const authHeaders = (): HeadersInit => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const mapUser = (user?: LoginApiUser): User | null => {
    if (!user) {
        return null;
    }

    const userId = user.user_id ?? user.userId ?? user.UserId;
    const email = user.email ?? user.Email;
    const name = user.name ?? user.Name;

    if (!email) {
        return null;
    }

    if (!userId) {
        return null;
    }

    return {
        user_id: userId,
        email,
        name,
    };
};

export const authAPI = {
    login: async (email: string, password: string): Promise<User | null> => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            return null;
        }

        const data = (await response.json()) as LoginApiResponse;
        const token = data.token ?? data.Token;
        if (token) {
            setAuthToken(token);
        }

        return mapUser(data.user ?? data.User);
    },

    logout: async (): Promise<void> => {
        setAuthToken(null);
        return Promise.resolve();
    },

    register: async (_email: string, _password: string, _name: string): Promise<User | null> => {
        return null;
    }
};

export const exerciseAPI = {
    getExercisesByProgram: async (programId: number): Promise<Exercise[]> => {
        const response = await fetch(`${API_BASE_URL}/exercises?programId=${programId}`, {
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
        });

        if (!response.ok) {
            return [];
        }

        return await response.json();
    },

    getAllExercises: async (): Promise<Exercise[]> => {
        const response = await fetch(`${API_BASE_URL}/exercises`, {
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
        });

        if (!response.ok) {
            return [];
        }

        return await response.json();
    }
};

export const workoutAPI = {
    logWorkout: async (workout: Omit<Workout, 'workout_id'>): Promise<Workout> => {
        const response = await fetch(`${API_BASE_URL}/workouts/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
            body: JSON.stringify({
                workouts: [
                    {
                        exerciseId: workout.exercise_id,
                        sets: workout.sets,
                        reps: workout.reps,
                        weight: workout.weight,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to log workout');
        }

        let createdWorkoutId: number | undefined;
        const responseContentType = response.headers.get('content-type') ?? '';

        if (responseContentType.includes('application/json')) {
            const created = await response.json() as { workout_id?: number };
            createdWorkoutId = created.workout_id;
        }

        return {
            ...workout,
            workout_id: createdWorkoutId,
            date: new Date().toISOString(),
        };
    },

    getUserWorkouts: async (_userId: number): Promise<Workout[]> => {
        const response = await fetch(`${API_BASE_URL}/workouts/me`, {
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
        });

        if (!response.ok) {
            return [];
        }

        return await response.json();
    },

    getLatestWorkout: async (_userId: number): Promise<Workout | null> => {
        const workouts = await workoutAPI.getUserWorkouts(_userId);
        return workouts.length > 0 ? workouts[0] : null;
    },

    getTotalWorkoutCount: async (_userId: number): Promise<number> => {
        const response = await fetch(`${API_BASE_URL}/workouts/stats`, {
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
        });

        if (!response.ok) {
            return 0;
        }

        const stats = await response.json() as { total_workouts?: number };
        return stats.total_workouts ?? 0;
    },

    saveCustomWorkout: async (payload: {
        name: string;
        exerciseIds: number[];
    }): Promise<void> => {
        const requestBody = {
            name: payload.name,
            workout_name: payload.name,
            exerciseIds: payload.exerciseIds,
            exercise_ids: payload.exerciseIds,
        };

        const endpoints = [
            `${API_BASE_URL}/workouts/custom`,
            `${API_BASE_URL}/custom-workouts`,
        ];

        for (const endpoint of endpoints) {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders(),
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                return;
            }

            if (response.status !== 404) {
                throw new Error('Failed to save custom workout');
            }
        }

        throw new Error('Custom workout endpoint not found');
    }
};

export const progressAPI = {
    getUserProgress: async (_userId: number): Promise<ProgressData[]> => {
        const response = await fetch(`${API_BASE_URL}/progress`, {
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
        });

        if (!response.ok) {
            return [];
        }

        return await response.json();
    }
};

export default {
    auth: authAPI,
    exercises: exerciseAPI,
    workouts: workoutAPI,
    progress: progressAPI
};
