using H2Oasis.Api.Models;
using H2Oasis.Api.Persistence;
using Microsoft.EntityFrameworkCore;

namespace H2Oasis.Api.Services;

public class HouseholdService : IHouseholdService
{

    private readonly AppDbContext _dbContext;

    public HouseholdService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Household>?> GetHouseholdsForUser(int userId)
    {
        var households = await _dbContext.UserHouseholds
            .Where(uh => uh.UserId == userId)
            .Select(uh => uh.Household)
            .ToListAsync();

        return households;
    }

    public async Task<Household?> GetHouseholdById(Guid householdId)
    {
        var household = await _dbContext.Households.FindAsync(householdId);
        return household ?? null;
    }

    public async Task<Household> CreateHousehold(Household newHousehold)
    {
        _dbContext.Households.Add(newHousehold);
        await _dbContext.SaveChangesAsync();
        return newHousehold;
    }

    public async Task<Household?> UpdateHouseHold(Household updatedHousehold)
    {
        var existingHousehold = await _dbContext.Households.FindAsync(updatedHousehold.Id);

        if (existingHousehold == null)
        {
            return null;
        }

        _dbContext.Entry(existingHousehold).CurrentValues.SetValues(updatedHousehold);
        await _dbContext.SaveChangesAsync();
        return existingHousehold;
    }

    public async Task<bool> DeleteHousehold(Guid householdId)
    {
        var household = await _dbContext.Households.FindAsync(householdId);

        if (household == null)
        {
            return false;
        }

        _dbContext.Households.Remove(household);
        await _dbContext.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> RemoveUserFromHousehold(int userId, Guid householdId)
    {
        var userHousehold = await _dbContext.UserHouseholds
            .FirstOrDefaultAsync(uh => uh.UserId == userId && uh.HouseholdId == householdId);

        if (userHousehold == null)
        {
            return false; // User is not associated with the specified household
        }

        _dbContext.UserHouseholds.Remove(userHousehold);
        await _dbContext.SaveChangesAsync();

        return true;
    }
    
}