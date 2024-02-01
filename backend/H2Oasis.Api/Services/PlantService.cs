using H2Oasis.Api.Models;
using H2Oasis.Api.Persistence;
using Microsoft.EntityFrameworkCore;

namespace H2Oasis.Api.Services;

public class PlantService : IPlantService
{
    private readonly PlantDbContext _dbContext;

    public PlantService(PlantDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Plant>?> GetPlantsForHousehold(Guid householdId)
    {
        var household = await _dbContext.Households
            .Include(h => h.Plants)
            .FirstOrDefaultAsync(h => h.HouseholdId == householdId);

        if (household is null)
        {
            return null;
        }
    
        IEnumerable<Plant> plants = household.Plants?.ToList() ?? new List<Plant>();
        return plants;
    }

    public async Task<Plant?> GetPlantById(Guid id)
    {
        var plant = await _dbContext.Plants.FindAsync(id);

        return plant ?? null;
    }

    public async Task<Plant> CreatePlantForHousehold(Plant newPlant)
    {
        // TODO: check if householdid is valid
        
        _dbContext.Plants.Add(newPlant);
        await _dbContext.SaveChangesAsync();
        return newPlant;
    }

    public async Task<Plant?> UpdatePlant(Plant updatedPlant)
    {
        var existingPlant = await _dbContext.Plants.FindAsync(updatedPlant.PlantId);

        if (existingPlant is null)
        {
            return null;
        }
        
        _dbContext.Entry(existingPlant).CurrentValues.SetValues(updatedPlant);

        await _dbContext.SaveChangesAsync();
        return existingPlant;
    }

    public async Task<bool> DeletePlant(Guid id)
    {
        var plant = await _dbContext.Plants.FindAsync(id);

        if (plant == null)
        {
            return false;
        }

        _dbContext.Plants.Remove(plant);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}