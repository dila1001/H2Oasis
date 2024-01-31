namespace H2Oasis.Api.Models;

public class UserHousehold
{
    public int UserId { get; set; }
    public User User { get; set; } = new();

    public int HouseholdId { get; set; }
    public Household Household { get; set; } = new();
}