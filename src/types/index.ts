export interface User {
    user_id: number;
    email: string;
    name?: string;
}

export interface Exercise {
    exercise_id?: number;
    exercise_name: string;
    program_id: number;
}

export interface Workout {
    workout_id?: number;
    user_id: number;
    exercise_id: number;
    sets: number;
    reps: number;
    weight: number;
    date?: string;
}

export interface Program {
    program_id: number;
    program_name: string;
    image_url?: string;
}

export interface WorkoutEntry {
    exercise_name: string;
    sets: number;
    reps: number;
    weight: number;
}

export interface ProgressData {
    program_name: string;
    exercises: {
        exercise_name: string;
        weight: number;
        reps: number;
    }[];
}

export type ProgramType = 'PUSH PROGRAM' | 'PULL PROGRAM' | 'LEGS PROGRAM' | 'CUSTOM';
