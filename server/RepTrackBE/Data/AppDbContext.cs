using Microsoft.EntityFrameworkCore;
using RepTrackBE.Models;

namespace RepTrackBE.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
}
