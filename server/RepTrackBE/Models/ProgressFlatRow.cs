namespace RepTrackBE.Models;

public sealed class ProgressFlatRow
{
    public string ProgramName { get; init; } = string.Empty;
    public string ExerciseName { get; init; } = string.Empty;
    public decimal Weight { get; init; }
    public int Reps { get; init; }
}
