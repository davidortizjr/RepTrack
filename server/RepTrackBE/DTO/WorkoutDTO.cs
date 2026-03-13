namespace RepTrackBE.DTO;

public record WorkoutCreateRequest(int ExerciseId, int Sets, int Reps, decimal Weight);

public record WorkoutBatchRequest(List<WorkoutCreateRequest> Workouts);

public record WorkoutBatchResponse(int TotalLogged, List<int> WorkoutIds);

public record WorkoutResponse(
    int WorkoutId,
    int UserId,
    int ExerciseId,
    int Sets,
    int Reps,
    decimal Weight,
    DateTime Date);
