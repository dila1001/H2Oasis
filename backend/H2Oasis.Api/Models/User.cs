using System.ComponentModel.DataAnnotations;

namespace H2Oasis.Api.Models;

public class User
{
    public string Id { get; set; }
    [MaxLength(255)]
    public string FirstName { get; set; } = string.Empty;
    [MaxLength(255)]
    public string LastName { get; set; } = string.Empty;
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    public IEnumerable<UserHousehold> UserHouseholds { get; set; } = [];
}