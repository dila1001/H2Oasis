using H2Oasis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace H2Oasis.Api.Persistence;

public class PlantDbContext : DbContext
{
    public PlantDbContext(DbContextOptions<PlantDbContext> options) : base(options)
    {
    }

    public DbSet<Plant> Plants { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Plant>(entity =>
        {
            entity.HasKey(plant => plant.Id);
        });
    }
    
}