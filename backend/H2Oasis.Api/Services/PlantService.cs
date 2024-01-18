using System.Text.Json;
using H2Oasis.Api.Contracts.Plant;
using H2Oasis.Api.Models;
using Postgrest;
using Client = Supabase.Client;

namespace H2Oasis.Api.Services;

public class PlantService : IPlantService
{
    private readonly Supabase.Client _client;

    public PlantService(Client client)
    {
        _client = client;
    }

    public async Task<IEnumerable<PlantResponse>> GetPlants()
    {
        var response = await _client
            .From<Plant>()
            .Get();

        var plants = response.Models.Select(plant => new PlantResponse(plant.Id, plant.Name, plant.Species,
            plant.ImageUrl, plant.WateringFrequencyInDays, plant.LastWatered));

        return plants;
    }

    public async Task<PlantResponse?> GetPlantById(int id)
    {
        var response = await _client
            .From<Plant>()
            .Where(plant => plant.Id == id)
            .Get();

        var plant = response.Models.FirstOrDefault();

        if (plant is null)
            return null;

        var plantResponse = new PlantResponse(plant.Id, plant.Name, plant.Species,
            plant.ImageUrl, plant.WateringFrequencyInDays, plant.LastWatered);

        return plantResponse;
    }
    
    public async Task<PlantResponse> CreatePlant(CreatePlantRequest plantRequest)
    {
        var newPlant = new Plant
        {
            Name = plantRequest.Name,
            Species = plantRequest.Species,
            ImageUrl = plantRequest.ImageUrl,
            WateringFrequencyInDays = plantRequest.WateringFrequencyInDays,
            LastWatered = plantRequest.LastWatered
        };
        
        var result = await _client.From<Plant>().Insert(newPlant, new QueryOptions() { Returning = QueryOptions.ReturnType.Representation });

        var insertedRecord = result.Model;

        return new PlantResponse(insertedRecord.Id, insertedRecord.Name, insertedRecord.Species,
            insertedRecord.ImageUrl, insertedRecord.WateringFrequencyInDays, insertedRecord.LastWatered);
    }
    
    // public Task<Plant> UpdatePlant(int id, Plant updatedPlant)
    // {
    //     throw new NotImplementedException();
    // }
    //
    // public Task<bool> DeletePlant(int id)
    // {
    //     throw new NotImplementedException();
    // }
}