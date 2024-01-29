using H2Oasis.Api.Models;

namespace H2Oasis.Api.Services;

public interface IPlantService
{
    Task<IEnumerable<Plant>> GetPlants();
    Task<Plant?> GetPlantById(Guid id);
    Task<Plant> CreatePlant(Plant newPlant);
    Task<Plant?> UpdatePlant(Plant updatedPlant);
    Task<Boolean> DeletePlant(Guid id);
}