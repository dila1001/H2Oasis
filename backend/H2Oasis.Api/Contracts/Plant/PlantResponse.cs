namespace H2Oasis.Api.Contracts.Plant;

public record PlantResponse(
    int Id,
    string Name,
    string Species,
    string ImageUrl,
    int WateringFrequencyInDays,
    DateTime LastWatered,
    int WaterAmount
    );