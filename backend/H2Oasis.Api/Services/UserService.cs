using System.Security.Claims;
using H2Oasis.Api.Contracts.User;
using H2Oasis.Api.Models;
using H2Oasis.Api.Persistence;
using Supabase;

namespace H2Oasis.Api.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }


    public async Task<User?> GetUserInfo(int id)
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
            Id = Int32.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value),
            FirstName = user.FindFirst(ClaimTypes.GivenName)!.Value,
            LastName = user.FindFirst(ClaimTypes.Surname)!.Value,
            Email = user.FindFirst(ClaimTypes.Email)!.Value
        };
        
        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();

        return newUser;
    }
    
}