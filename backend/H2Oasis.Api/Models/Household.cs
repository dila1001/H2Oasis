using System.ComponentModel.DataAnnotations;

namespace H2Oasis.Api.Models;

public class Household
{
    public Guid Id { get; set; }
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    public IEnumerable<UserHousehold> UserHouseholds { get; set; } = [];
    public IEnumerable<Plant> Plants { get; set; } = [];
}