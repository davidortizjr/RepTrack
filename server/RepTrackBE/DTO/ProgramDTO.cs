namespace RepTrackBE.DTO;

public record ProgramResponse(int ProgramId, string ProgramName);

public record ExerciseResponse(int ExerciseId, string ExerciseName, int ProgramId);
