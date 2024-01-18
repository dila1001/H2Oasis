namespace H2Oasis.Api.Contracts.Plant;

public record UpdatePlantRequest(
    string Name,
    string Species,
    string? ImageUrl,
    int WateringFrequencyInDays,
    DateTime LastWatered);