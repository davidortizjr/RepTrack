using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RepTrackBE.Data;
using RepTrackBE.DTO;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly RepTrackBE.Data.AppDbContext _db;

        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] LoginDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _db.Users
                    .FirstOrDefaultAsync(u => u.Email == dto.Email
                        && u.PasswordHash == dto.Password
                        && u.IsActive);

                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                user.LastLogin = DateTime.Now;
                await _db.SaveChangesAsync();

                var response = new LoginResponseDTO
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role,
                    AvatarUrl = user.AvatarUrl
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}