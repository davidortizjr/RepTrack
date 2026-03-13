using System.Security.Cryptography;
using System.Text;

namespace RepTrackBE.Services;

public static class PasswordHasher
{
    public static byte[] Hash(string password, Guid salt)
    {
        var passwordBytes = Encoding.Unicode.GetBytes(password);
        var saltBytes = salt.ToByteArray();

        var combined = new byte[saltBytes.Length + passwordBytes.Length];
        Buffer.BlockCopy(saltBytes, 0, combined, 0, saltBytes.Length);
        Buffer.BlockCopy(passwordBytes, 0, combined, saltBytes.Length, passwordBytes.Length);

        return SHA256.HashData(combined);
    }

    public static bool Verify(string password, Guid salt, byte[] expectedHash)
    {
        var computedHash = Hash(password, salt);
        return CryptographicOperations.FixedTimeEquals(computedHash, expectedHash);
    }
}
