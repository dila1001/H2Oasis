using H2Oasis.Api.Models;
using H2Oasis.Api.Persistence;
using Microsoft.EntityFrameworkCore;

namespace H2Oasis.Api.Services;

public class HouseholdService : IHouseholdService
{

    private readonly PlantDbContext _dbContext;

    public HouseholdService(PlantDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Household>?> GetHouseholdsForUser(string userId)
    {
        var households = await _dbContext.UserHouseholds
            .Where(uh => uh.UserId == userId)
            .Include(uh => uh.Household)
            .ThenInclude(h => h.UserHouseholds)
            .ThenInclude(uh => uh.User) 
            .Include(uh => uh.Household.Plants)
            .ToListAsync();
        
        return households.Select(uh => uh.Household);
    }

    public async Task<Household?> GetHouseholdById(Guid householdId)
    {
        var household = await _dbContext.Households
            .Where(h => h.HouseholdId == householdId)
            .Include(h => h.UserHouseholds)
            .ThenInclude(uh => uh.User)
            .Include(h => h.Plants)
            .FirstOrDefaultAsync();

        if (household == null)
        {
            return null;
        }
        
        return household;
    }

    public async Task<Household> CreateHousehold(Household newHousehold)
    {
        _dbContext.Households.Add(newHousehold);
        await _dbContext.SaveChangesAsync();
        
        var createdHousehold = await _dbContext.Households
            .Where(h => h.HouseholdId == newHousehold.HouseholdId)
            .Include(h => h.UserHouseholds)
            .ThenInclude(uh => uh.User)
            .Include(h => h.Plants)
            .FirstOrDefaultAsync();

        return createdHousehold;
    }

    public async Task<Household?> UpdateHouseHold(Household updatedHousehold)
    {
        var existingHousehold = await _dbContext.Households.FindAsync(updatedHousehold.HouseholdId);

        if (existingHousehold == null)
        {
            return null;
        }

        _dbContext.Entry(existingHousehold).CurrentValues.SetValues(updatedHousehold);
        await _dbContext.SaveChangesAsync();
        return existingHousehold;
        
       
        // var updatedHouseholdWithDetails = await _dbContext.Households
        //     .Where(h => h.HouseholdId == updatedHousehold.HouseholdId)
        //     .Include(h => h.UserHouseholds)
        //     .ThenInclude(uh => uh.User)
        //     .Include(h => h.Plants)
        //     .FirstOrDefaultAsync();
        //
        // return (updatedHouseholdWithDetails);
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
    
    public async Task<bool> RemoveUserFromHousehold(string userId, Guid householdId)
    {
        var userHousehold = await _dbContext.UserHouseholds
            .FirstOrDefaultAsync(uh => uh.User.UserId == userId && uh.Household.HouseholdId == householdId);

        if (userHousehold == null)
        {
            return false; // User is not associated with the specified household
        }

        _dbContext.UserHouseholds.Remove(userHousehold);
        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<bool> AddUserToHousehold(string userId, Guid householdId)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        var household = await _dbContext.Households.FindAsync(householdId);

        if (user == null || household == null)
        {
            return false;
        }
        
        var userHousehold = new UserHousehold
        {
            UserId = userId,
            User = user,
            HouseholdId = householdId,
            Household = household,
        };
        
         _dbContext.UserHouseholds.Add(userHousehold);
        
        await _dbContext.SaveChangesAsync();
        return true;
    }
}