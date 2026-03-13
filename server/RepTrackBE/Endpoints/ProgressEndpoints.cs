using System.Security.Claims;
using Dapper;
using Microsoft.Data.SqlClient;
using RepTrackBE.Extensions;
using RepTrackBE.Models;

namespace RepTrackBE.Endpoints;

public static class ProgressEndpoints
{
    public static void MapProgressEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/progress", async (
            ClaimsPrincipal principal,
            IConfiguration configuration) =>
        {
            var userId = principal.GetUserId();
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;

            await using var connection = new SqlConnection(connectionString);

            const string sql = """
                WITH RankedProgress AS (
                    SELECT
                        p.ProgramName,
                        e.ExerciseName,
                        wl.[Weight],
                        wl.Reps,
                        ROW_NUMBER() OVER (
                            PARTITION BY e.ExerciseId
                            ORDER BY wl.[Weight] DESC, wl.Reps DESC, wl.LoggedAt DESC
                        ) AS rn
                    FROM WorkoutLogs wl
                    INNER JOIN Exercises e ON e.ExerciseId = wl.ExerciseId
                    INNER JOIN Programs p ON p.ProgramId = e.ProgramId
                    WHERE wl.UserId = @UserId
                )
                SELECT
                    ProgramName,
                    ExerciseName,
                    [Weight],
                    Reps
                FROM RankedProgress
                WHERE rn = 1
                ORDER BY ProgramName, ExerciseName;
                """;

            var flatRows = await connection.QueryAsync<ProgressFlatRow>(sql, new { UserId = userId });

            var result = flatRows
                .GroupBy(x => x.ProgramName)
                .Select(group => new
                {
                    program_name = group.Key,
                    exercises = group.Select(item => new
                    {
                        exercise_name = item.ExerciseName,
                        weight = item.Weight,
                        reps = item.Reps
                    })
                });

            return Results.Ok(result);
        }).RequireAuthorization();
    }
}
