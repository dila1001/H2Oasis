using System.Security.Claims;
using H2Oasis.Api.Models;
using H2Oasis.Api.Persistence;
using Microsoft.EntityFrameworkCore;


namespace H2Oasis.Api.Services;

public class UserService : IUserService
{
    private readonly PlantDbContext _dbContext;

    public UserService(PlantDbContext dbContext)
    {
        _dbContext = dbContext;
    }


    public async Task<User?> GetUserInfo(string id)
    {
        var user = await _dbContext.Users.FindAsync(id);

        if (user is null)
        {
            return null;
        }

        return user;
    }

    public async Task<User> CreateUserFromClaims(ClaimsPrincipal user)
    {
        var newUser = new User
        {
            UserId = user.FindFirst(ClaimTypes.NameIdentifier)!.Value,
            FirstName = user.FindFirst(ClaimTypes.GivenName)!.Value,
            LastName = user.FindFirst(ClaimTypes.Surname)!.Value,
            Email = user.FindFirst(ClaimTypes.Email)!.Value
        };
        
        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();

        return newUser;
    }

    public async Task<IEnumerable<User>> GetUsersForHousehold(Guid houseHoldId)
    {
        var users = await _dbContext.UserHouseholds
            .Where(uh => uh.HouseholdId == houseHoldId)
            .Select(uh => uh.User)
            .ToListAsync();

        return users;
    }
}