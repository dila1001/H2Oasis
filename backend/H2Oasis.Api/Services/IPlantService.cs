using H2Oasis.Api.Models;

namespace H2Oasis.Api.Services;

public interface IPlantService
{
    Task<IEnumerable<Plant>?> GetPlantsForHousehold(Guid householdId);
    Task<Plant?> GetPlantById(Guid id);
    Task<Plant> CreatePlantForHousehold(Plant newPlant);
    Task<Plant?> UpdatePlant(Plant updatedPlant);
    Task<Boolean> DeletePlant(Guid id);
}