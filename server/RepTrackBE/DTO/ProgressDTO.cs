namespace RepTrackBE.DTO;

public record ProgressResponse(string ProgramName, IEnumerable<ExerciseProgress> Exercises);

public record ExerciseProgress(string ExerciseName, decimal Weight, int Reps);

public record WorkoutStatsResponse(string? LastWorkout, int TotalWorkouts);
