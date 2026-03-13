using Dapper;
using Microsoft.Data.SqlClient;

namespace RepTrackBE.Endpoints;

public static class ProgramEndpoints
{
    public static void MapProgramEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/programs", async (IConfiguration configuration) =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;
            await using var connection = new SqlConnection(connectionString);

            const string sql = """
                SELECT ProgramId AS program_id, ProgramName AS program_name
                FROM Programs
                ORDER BY ProgramId;
                """;

            var programs = await connection.QueryAsync(sql);
            return Results.Ok(programs);
        }).RequireAuthorization();

        app.MapGet("/api/exercises", async (int? programId, IConfiguration configuration) =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;
            await using var connection = new SqlConnection(connectionString);

            const string sql = """
                SELECT ExerciseId AS exercise_id, ExerciseName AS exercise_name, ProgramId AS program_id
                FROM Exercises
                WHERE (@ProgramId IS NULL OR ProgramId = @ProgramId)
                ORDER BY ExerciseId;
                """;

            var exercises = await connection.QueryAsync(sql, new { ProgramId = programId });
            return Results.Ok(exercises);
        }).RequireAuthorization();
    }
}
