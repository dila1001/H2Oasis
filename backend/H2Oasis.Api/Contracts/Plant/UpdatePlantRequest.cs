namespace H2Oasis.Api.Contracts.Plant;

public record UpdatePlantRequest(
    string Name,
    string Species,
    IFormFile? Image,
    string? ImageUrl,
    string Location,
    int WateringFrequencyInDays,
    DateTime LastWatered,
    string LastWateredBy,
    int WaterAmountInMl);