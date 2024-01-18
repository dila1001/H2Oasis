using H2Oasis.Api.Contracts.Plant;
using H2Oasis.Api.Models;

namespace H2Oasis.Api.Services;

public interface IPlantService
{
    Task<IEnumerable<PlantResponse>> GetPlants();
    Task<PlantResponse?> GetPlantById(int id);
    Task<PlantResponse> CreatePlant(CreatePlantRequest plantRequest);
    Task<PlantResponse?> UpdatePlant(int id, UpdatePlantRequest updatedPlant);
    // Task<Boolean> DeletePlant(int id);
}