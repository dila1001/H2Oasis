namespace H2Oasis.Api.Contracts.Plant;

public record PlantResponse(
    Guid Id,
    string Name,
    string Species,
    string ImageUrl,
    int WateringFrequencyInDays,
    DateTime LastWatered,
    int WaterAmountInMl,
    Guid HouseholdId
    );