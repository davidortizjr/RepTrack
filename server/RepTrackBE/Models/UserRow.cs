namespace RepTrackBE.Models;

public sealed class UserRow
{
    public int UserId { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public Guid PasswordSalt { get; init; }
    public byte[] PasswordHash { get; init; } = [];
}
