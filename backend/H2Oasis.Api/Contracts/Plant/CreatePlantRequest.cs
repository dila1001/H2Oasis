namespace H2Oasis.Api.Contracts.Plant;

public record CreatePlantRequest(
    string Name,
    string Species,
    string ImageUrl,
    int WateringFrequencyInDays,
    DateTime LastWatered,
    int WaterAmountInMl
    );