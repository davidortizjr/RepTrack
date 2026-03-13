namespace RepTrackBE.DTO;

public record SaveCustomWorkoutRequest(string Name, List<int> ExerciseIds);

public record CustomWorkoutResponse(
    int ProgramId,
    string Name,
    int UserId,
    DateTime CreatedAt,
    List<int> ExerciseIds);

public record CustomWorkoutListItem(
    int ProgramId,
    string Name,
    int ExerciseCount,
    DateTime CreatedAt);
