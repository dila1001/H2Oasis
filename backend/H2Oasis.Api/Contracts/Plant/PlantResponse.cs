namespace H2Oasis.Api.Contracts.Plant;

public record PlantResponse(
    Guid Id,
    string Name,
    string Species,
    string ImageUrl,
    string Location,
    int WateringFrequencyInDays,
    DateTime LastWatered,
    string LastWateredBy,
    int WaterAmountInMl,
    Guid HouseholdId
    );