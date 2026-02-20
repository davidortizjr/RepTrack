import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgram } from '../context/ProgramContext';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';

interface ExerciseData {
    exercise_name: string;
    sets: number;
    reps: number;
    weight: number;
}

const Workouts: React.FC = () => {
    const { selectedProgram, programId } = useProgram();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<{ exercise_name: string }[]>([]);
    const [workoutData, setWorkoutData] = useState<Record<string, ExerciseData>>({});

    useEffect(() => {
        if (!programId) {
            navigate('/home');
            return;
        }

        const mockExercises: Record<number, { exercise_name: string }[]> = {
            1: [
                { exercise_name: 'Bench Press' },
                { exercise_name: 'Machine Flyes' },
                { exercise_name: 'Incline Bench Press' },
                { exercise_name: 'Dumbbell Flyes' },
                { exercise_name: 'Tricep Pushdowns' },
                { exercise_name: 'Overhead Press' },
            ],
            2: [
                { exercise_name: 'T-Bar Row' },
                { exercise_name: 'Lat Pulldown' },
                { exercise_name: 'Cable Row' },
                { exercise_name: 'Face Pulls' },
                { exercise_name: 'Bicep Curls' },
                { exercise_name: 'Hammer Curls' },
            ],
            3: [
                { exercise_name: 'Barbell Squats' },
                { exercise_name: 'Leg Press' },
                { exercise_name: 'Romanian Deadlift' },
                { exercise_name: 'Leg Extension' },
                { exercise_name: 'Leg Curl' },
                { exercise_name: 'Calf Raises' },
            ],
        };

        if (programId && mockExercises[programId]) {
            setExercises(mockExercises[programId]);
        }
    }, [programId, navigate]);

    const handleInputChange = (exerciseName: string, field: keyof ExerciseData, value: string) => {
        setWorkoutData((prev) => ({
            ...prev,
            [exerciseName]: {
                ...prev[exerciseName],
                exercise_name: exerciseName,
                [field]: field === 'exercise_name' ? value : Number(value),
            } as ExerciseData,
        }));
    };

    const handleSubmit = (exerciseName: string) => {
        const data = workoutData[exerciseName];
        if (data && data.sets && data.reps && data.weight) {
            console.log('Submitting workout:', data);
            alert(`Workout logged: ${exerciseName} - ${data.sets}x${data.reps} @ ${data.weight}kg`);

            setWorkoutData((prev) => {
                const newData = { ...prev };
                delete newData[exerciseName];
                return newData;
            });
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-32">
            <Navbar title={selectedProgram || 'WORKOUTS'} />
            <BackButton />

            <main className="px-6 mt-2 space-y-4">
                {exercises.map((exercise) => (
                    <div
                        key={exercise.exercise_name}
                        className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-white/5"
                    >
                        <h5 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">
                            {exercise.exercise_name}
                        </h5>

                        <div className="space-y-4">
                            <div className="flex items-end gap-3">
                                <div className="flex-1">
                                    <label
                                        htmlFor={`sets-${exercise.exercise_name}`}
                                        className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide"
                                    >
                                        Sets
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
                                        id={`sets-${exercise.exercise_name}`}
                                        value={workoutData[exercise.exercise_name]?.sets || ''}
                                        onChange={(e) =>
                                            handleInputChange(exercise.exercise_name, 'sets', e.target.value)
                                        }
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>
                                <span className="text-slate-400 dark:text-slate-500 font-bold pb-2 text-xl">×</span>
                                <div className="flex-1">
                                    <label
                                        htmlFor={`reps-${exercise.exercise_name}`}
                                        className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide"
                                    >
                                        Reps
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
                                        id={`reps-${exercise.exercise_name}`}
                                        value={workoutData[exercise.exercise_name]?.reps || ''}
                                        onChange={(e) =>
                                            handleInputChange(exercise.exercise_name, 'reps', e.target.value)
                                        }
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor={`weight-${exercise.exercise_name}`}
                                    className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide"
                                >
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
                                    id={`weight-${exercise.exercise_name}`}
                                    value={workoutData[exercise.exercise_name]?.weight || ''}
                                    onChange={(e) =>
                                        handleInputChange(exercise.exercise_name, 'weight', e.target.value)
                                    }
                                    min="0"
                                    placeholder="0"
                                />
                            </div>

                            <button
                                className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold tracking-wide transition-all active:scale-95 shadow-md shadow-primary/20"
                                onClick={() => handleSubmit(exercise.exercise_name)}
                            >
                                LOG WORKOUT
                            </button>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Workouts;
