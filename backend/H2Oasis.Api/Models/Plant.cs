using System.ComponentModel.DataAnnotations;
using H2Oasis.Api.Contracts.Plant;

namespace H2Oasis.Api.Models;
public class Plant
{
    public Guid Id { get; set; }
    [MaxLength(255)]
    public string Name { get; set; }
    [MaxLength(255)]
    public string Species { get; set; }
    [MaxLength(255)]
    public string ImageUrl { get; set; }
    [MaxLength(255)]
    public string Location { get; set; }
    public int WateringFrequencyInDays { get; set; }
    public DateTime LastWatered { get; set; }
    [MaxLength(255)]
    public string LastWateredBy { get; set; }
    public int WaterAmountInMl { get; set; }
    
    public Guid HouseholdId { get; set; }
    
    public Household Household { get; set; }
    
    public Plant()
    {
    }

    public Plant(string name, string species, string imageUrl, string location, int wateringFreq, DateTime lastWatered, string lastWateredBy, int waterAmount, Guid householdId, Guid? id = null)
    {
        Id = id ?? Guid.NewGuid();
        Name = name;
        Species = species;
        ImageUrl = imageUrl;
        Location = location;
        WateringFrequencyInDays = wateringFreq;
        LastWatered = lastWatered;
        LastWateredBy = lastWateredBy;
        WaterAmountInMl = waterAmount;
        HouseholdId = householdId;
    }

    public static Plant From(CreatePlantRequest request)
    {
        return new Plant(
            request.Name,
            request.Species,
            request.ImageUrl,
            request.Location,
            request.WateringFrequencyInDays,
            request.LastWatered,
            request.LastWateredBy,
            request.WaterAmountInMl,
            request.HouseholdId
            );
    }
    
    public static Plant From(Guid id, UpdatePlantRequest request)
    {
        return new Plant(
            request.Name,
            request.Species,
            request.ImageUrl,
            request.Location,
            request.WateringFrequencyInDays,
            request.LastWatered,
            request.LastWateredBy,
            request.WaterAmountInMl,
            request.HouseholdId,
            id
        );
    }
}