using System.Security.Claims;
using Dapper;
using Microsoft.Data.SqlClient;
using RepTrackBE.DTO;
using RepTrackBE.Extensions;

namespace RepTrackBE.Endpoints;

public static class CustomWorkoutEndpoints
{
    public static void MapCustomWorkoutEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/custom-workouts", async (
            SaveCustomWorkoutRequest request,
            ClaimsPrincipal principal,
            IConfiguration configuration) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return Results.BadRequest(new { message = "Workout name is required" });
            }

            if (request.ExerciseIds == null || request.ExerciseIds.Count == 0)
            {
                return Results.BadRequest(new { message = "At least one exercise is required" });
            }

            var userId = principal.GetUserId();
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;

            await using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                const string insertProgramSql = """
                    INSERT INTO Programs (ProgramName, UserId)
                    OUTPUT INSERTED.ProgramId
                    VALUES (@ProgramName, @UserId);
                    """;

                var programId = await connection.ExecuteScalarAsync<int>(insertProgramSql, new
                {
                    ProgramName = request.Name,
                    UserId = userId
                }, transaction);

                const string insertProgramExerciseSql = """
                    INSERT INTO ProgramExercises (ProgramId, ExerciseId, OrderIndex)
                    VALUES (@ProgramId, @ExerciseId, @OrderIndex);
                    """;

                for (int i = 0; i < request.ExerciseIds.Count; i++)
                {
                    await connection.ExecuteAsync(insertProgramExerciseSql, new
                    {
                        ProgramId = programId,
                        ExerciseId = request.ExerciseIds[i],
                        OrderIndex = i
                    }, transaction);
                }

                await transaction.CommitAsync();

                return Results.Ok(new
                {
                    program_id = programId,
                    message = "Custom workout saved successfully"
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Results.BadRequest(new { message = "Failed to save custom workout", error = ex.Message });
            }
        }).RequireAuthorization();

        app.MapGet("/api/custom-workouts/me", async (
            ClaimsPrincipal principal,
            IConfiguration configuration) =>
        {
            var userId = principal.GetUserId();
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;

            await using var connection = new SqlConnection(connectionString);

            const string sql = """
                SELECT
                    p.ProgramId AS program_id,
                    p.ProgramName AS program_name,
                    COUNT(pe.ExerciseId) AS exercise_count
                FROM Programs p
                LEFT JOIN ProgramExercises pe ON pe.ProgramId = p.ProgramId
                WHERE p.UserId = @UserId
                GROUP BY p.ProgramId, p.ProgramName
                ORDER BY p.ProgramId DESC;
                """;

            var workouts = await connection.QueryAsync(sql, new { UserId = userId });
            return Results.Ok(workouts);
        }).RequireAuthorization();

        app.MapGet("/api/custom-workouts/{programId:int}", async (
            int programId,
            ClaimsPrincipal principal,
            IConfiguration configuration) =>
        {
            var userId = principal.GetUserId();
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;

            await using var connection = new SqlConnection(connectionString);

            const string programSql = """
                SELECT ProgramId, ProgramName, UserId
                FROM Programs
                WHERE ProgramId = @ProgramId AND UserId = @UserId;
                """;

            var program = await connection.QuerySingleOrDefaultAsync(programSql, new
            {
                ProgramId = programId,
                UserId = userId
            });

            if (program == null)
            {
                return Results.NotFound(new { message = "Custom workout not found" });
            }

            const string exercisesSql = """
                SELECT ExerciseId AS exercise_id
                FROM ProgramExercises
                WHERE ProgramId = @ProgramId
                ORDER BY OrderIndex;
                """;

            var exerciseIds = await connection.QueryAsync<int>(exercisesSql, new { ProgramId = programId });

            return Results.Ok(new
            {
                program_id = program.ProgramId,
                name = program.ProgramName,
                user_id = program.UserId,
                exercise_ids = exerciseIds
            });
        }).RequireAuthorization();

        app.MapDelete("/api/custom-workouts/{programId:int}", async (
            int programId,
            ClaimsPrincipal principal,
            IConfiguration configuration) =>
        {
            var userId = principal.GetUserId();
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;

            await using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                const string deleteExercisesSql = """
                    DELETE FROM ProgramExercises
                    WHERE ProgramId = @ProgramId;
                    """;

                await connection.ExecuteAsync(deleteExercisesSql, new { ProgramId = programId }, transaction);

                const string deleteProgramSql = """
                    DELETE FROM Programs
                    WHERE ProgramId = @ProgramId AND UserId = @UserId;
                    """;

                var rowsAffected = await connection.ExecuteAsync(deleteProgramSql, new
                {
                    ProgramId = programId,
                    UserId = userId
                }, transaction);

                if (rowsAffected == 0)
                {
                    await transaction.RollbackAsync();
                    return Results.NotFound(new { message = "Custom workout not found or unauthorized" });
                }

                await transaction.CommitAsync();

                return Results.Ok(new { message = "Custom workout deleted successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Results.BadRequest(new { message = "Failed to delete custom workout", error = ex.Message });
            }
        }).RequireAuthorization();
    }
}
