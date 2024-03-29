using System.Security.Claims;
using H2Oasis.Api.Contracts.User;
using H2Oasis.Api.Models;

namespace H2Oasis.Api.Services;

public interface IUserService
{
    Task<User?> GetUserInfo(string id);
    Task<User> CreateUserFromClaims(ClaimsPrincipal user);
    Task<IEnumerable<User>> GetUsersForHousehold(Guid houseHoldId);
}