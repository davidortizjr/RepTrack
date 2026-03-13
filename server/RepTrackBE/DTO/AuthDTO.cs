namespace RepTrackBE.DTO;

public record LoginRequest(string Email, string Password);

public record LoginResponse(string Token, UserDto User);

public record UserDto(int UserId, string Email, string Name);
