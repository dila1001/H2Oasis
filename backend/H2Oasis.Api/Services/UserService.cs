using System.Security.Claims;
using H2Oasis.Api.Contracts.User;
using H2Oasis.Api.Models;
using Supabase;

namespace H2Oasis.Api.Services;

public class UserService : IUserService
{
    private readonly Supabase.Client _client;

    public UserService(Client client)
    {
        _client = client;
    }

    public async Task<UserResponse?> GetUserInfo(string id)
    {
        var intId = int.Parse(id);
        var response = await _client
            .From<User>()
            .Where(s => s.Id == intId)
            .Single();

            UserResponse user = new UserResponse(response!.Id, response.FirstName, response.LastName);

        return user;
    }

    public async Task<User> CreateUserFromClaims(ClaimsPrincipal user)
    {
        var newUser = new User
        {
            Id = Int32.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value),
            FirstName = user.FindFirst(ClaimTypes.GivenName)!.Value,
            LastName = user.FindFirst(ClaimTypes.Surname)!.Value
        };
        
        await _client.From<User>().Insert(newUser);

        return newUser;
    }
    
}