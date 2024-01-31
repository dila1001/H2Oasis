using H2Oasis.Api.Models;

namespace H2Oasis.Api.Services;

public interface IHouseholdService
{
    Task<IEnumerable<Household>?> GetHouseholdsForUser(int userId);
    Task<Household?> GetHouseholdById(Guid householdId);
    Task<Household> CreateHousehold(Household newHousehold);
    Task<Household?> UpdateHouseHold(Household updatedHousehold);
    Task<Boolean> DeleteHousehold(Guid householdId);
    Task<Boolean> RemoveUserFromHousehold(int userId, Guid householdId);
}