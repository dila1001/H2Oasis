namespace H2Oasis.Api.Contracts.Plant;

public record CreatePlantRequest(
    string Name,
    string Species,
    IFormFile? ImageUrl,
    string? Location,
    int WateringFrequencyInDays,
    DateTime LastWatered,
    string? LastWateredBy,
    int WaterAmountInMl
    );