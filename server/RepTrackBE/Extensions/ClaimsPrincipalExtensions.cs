using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RepTrackBE.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal principal)
    {
        var sub = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(sub, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid token subject.");
        }

        return userId;
    }
}
