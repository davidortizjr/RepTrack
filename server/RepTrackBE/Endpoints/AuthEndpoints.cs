using Dapper;
using Microsoft.Data.SqlClient;
using RepTrackBE.DTO;
using RepTrackBE.Models;
using RepTrackBE.Services;

namespace RepTrackBE.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/login", async (
            LoginRequest request,
            IConfiguration configuration) =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;
            var jwtKey = configuration["Jwt:Key"]!;
            var jwtIssuer = configuration["Jwt:Issuer"] ?? "RepTrack.Api";
            var jwtAudience = configuration["Jwt:Audience"] ?? "RepTrack.Client";
            var jwtExpiryMinutes = int.TryParse(configuration["Jwt:ExpiryMinutes"], out var minutes) ? minutes : 120;

            await using var connection = new SqlConnection(connectionString);

            const string sql = """
                SELECT UserId, Email, [Name], PasswordSalt, PasswordHash
                FROM Users
                WHERE Email = @Email;
                """;

            var user = await connection.QuerySingleOrDefaultAsync<UserRow>(sql, new { request.Email });

            if (user is null || !PasswordHasher.Verify(request.Password, user.PasswordSalt, user.PasswordHash))
            {
                return Results.Unauthorized();
            }

            var token = JwtTokenGenerator.Create(
                user.UserId,
                user.Email,
                user.Name,
                jwtKey,
                jwtIssuer,
                jwtAudience,
                jwtExpiryMinutes);

            return Results.Ok(new LoginResponse(
                token,
                new UserDto(user.UserId, user.Email, user.Name)
            ));
        });
    }
}
