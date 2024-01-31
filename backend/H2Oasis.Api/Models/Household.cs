using System.ComponentModel.DataAnnotations;

namespace H2Oasis.Api.Models;

public class Household
{
    public Guid HouseholdId { get; set; } = Guid.NewGuid();
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    public IEnumerable<UserHousehold> UserHouseholds { get; set; } = new List<UserHousehold>();
    public IEnumerable<Plant> Plants { get; set; } = new List<Plant>();
}