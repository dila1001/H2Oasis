using H2Oasis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace H2Oasis.Api.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Plant> Plants { get; set; }
    public DbSet<Household> Households { get; set; }
    public DbSet<UserHousehold> UserHouseholds { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserHousehold>()
            .HasKey(uh => new { uh.UserId, uh.HouseholdId });

        modelBuilder.Entity<UserHousehold>()
            .HasOne(uh => uh.User)
            .WithMany(u => u.UserHouseholds)
            .HasForeignKey(uh => uh.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserHousehold>()
            .HasOne(uh => uh.Household)
            .WithMany(h => h.UserHouseholds)
            .HasForeignKey(uh => uh.HouseholdId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Plant>()
            .HasOne(p => p.Household)
            .WithMany(h => h.Plants)
            .HasForeignKey(p => p.HouseholdId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}