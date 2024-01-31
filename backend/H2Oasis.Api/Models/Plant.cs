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
    public int WateringFrequencyInDays { get; set; }
    public DateTime LastWatered { get; set; }
    public int WaterAmountInMl { get; set; }
    
    public Guid HouseholdId { get; set; }
    
    public Household Household { get; set; }
    
    public Plant()
    {
    }

    public Plant(string name, string species, string imageUrl, int wateringFreq, DateTime lastWatered, int waterAmount, Guid? id = null)
    {
        Id = id ?? Guid.NewGuid();
        Name = name;
        Species = species;
        ImageUrl = imageUrl;
        WateringFrequencyInDays = wateringFreq;
        LastWatered = lastWatered;
        WaterAmountInMl = waterAmount;
    }

    public static Plant From(CreatePlantRequest request)
    {
        return new Plant(
            request.Name,
            request.Species,
            request.ImageUrl,
            request.WateringFrequencyInDays,
            request.LastWatered,
            request.WaterAmountInMl
            );
    }
    
    public static Plant From(Guid id, UpdatePlantRequest request)
    {
        return new Plant(
            request.Name,
            request.Species,
            request.ImageUrl,
            request.WateringFrequencyInDays,
            request.LastWatered,
            request.WaterAmountInMl,
            id
        );
    }
}