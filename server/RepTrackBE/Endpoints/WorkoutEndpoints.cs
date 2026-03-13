using System.Security.Claims;
using Dapper;
using Microsoft.Data.SqlClient;
using RepTrackBE.DTO;
using RepTrackBE.Extensions;

namespace RepTrackBE.Endpoints;

public static class WorkoutEndpoints
{
    public static void MapWorkoutEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/workouts/batch", async (
            WorkoutBatchRequest request,
            ClaimsPrincipal principal,
            IConfiguration configuration) =>
        {
            if (request.Workouts == null || request.Workouts.Count == 0)
            {
                return Results.BadRequest(new { message = "No workouts provided" });
            }

            var userId = principal.GetUserId();
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;

            await using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                const string sql = """
                    INSERT INTO WorkoutLogs (UserId, ExerciseId, [Sets], Reps, [Weight], LoggedAt)
                    OUTPUT INSERTED.WorkoutId
                    VALUES (@UserId, @ExerciseId, @Sets, @Reps, @Weight, SYSUTCDATETIME());
                    """;

                var workoutIds = new List<int>();

                foreach (var workout in request.Workouts)
                {
                    var workoutId = await connection.ExecuteScalarAsync<int>(sql, new
                    {
                        UserId = userId,
                        ExerciseId = workout.ExerciseId,
                        Sets = workout.Sets,
                        Reps = workout.Reps,
                        Weight = workout.Weight
                    }, transaction);

                    workoutIds.Add(workoutId);
                }

                await transaction.CommitAsync();

                return Results.Ok(new WorkoutBatchResponse(
                    TotalLogged: workoutIds.Count,
                    WorkoutIds: workoutIds
                ));
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Results.BadRequest(new { message = "Failed to log workouts", error = ex.Message });
            }
        }).RequireAuthorization();

        app.MapGet("/api/workouts/me", async (
            ClaimsPrincipal principal,
            IConfiguration configuration) =>
        {
            var userId = principal.GetUserId();
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;

            await using var connection = new SqlConnection(connectionString);

            const string sql = """
                SELECT
                    wl.WorkoutId AS workout_id,
                    wl.UserId AS user_id,
                    wl.ExerciseId AS exercise_id,
                    wl.[Sets] AS sets,
                    wl.Reps AS reps,
                    wl.[Weight] AS weight,
                    wl.LoggedAt AS [date]
                FROM WorkoutLogs wl
                WHERE wl.UserId = @UserId
                ORDER BY wl.LoggedAt DESC;
                """;

            var workouts = await connection.QueryAsync(sql, new { UserId = userId });
            return Results.Ok(workouts);
        }).RequireAuthorization();

        app.MapGet("/api/workouts/stats", async (
            ClaimsPrincipal principal,
            IConfiguration configuration) =>
        {
            var userId = principal.GetUserId();
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;

            await using var connection = new SqlConnection(connectionString);

            const string latestWorkoutSql = """
                SELECT TOP 1 p.ProgramName
                FROM WorkoutLogs wl
                INNER JOIN Exercises e ON e.ExerciseId = wl.ExerciseId
                INNER JOIN Programs p ON p.ProgramId = e.ProgramId
                WHERE wl.UserId = @UserId
                ORDER BY wl.LoggedAt DESC;
                """;

            const string totalCountSql = """
                SELECT COUNT(*)
                FROM WorkoutLogs
                WHERE UserId = @UserId;
                """;

            var latestProgram = await connection.ExecuteScalarAsync<string?>(latestWorkoutSql, new { UserId = userId });
            var totalWorkouts = await connection.ExecuteScalarAsync<int>(totalCountSql, new { UserId = userId });

            return Results.Ok(new
            {
                last_workout = latestProgram,
                total_workouts = totalWorkouts
            });
        }).RequireAuthorization();
    }
}
