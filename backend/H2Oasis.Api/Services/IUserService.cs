using System.Security.Claims;
using H2Oasis.Api.Contracts.User;
using H2Oasis.Api.Models;

namespace H2Oasis.Api.Services;

public interface IUserService
{
    Task<User?> GetUserInfo(int id);
    Task<User> CreateUserFromClaims(ClaimsPrincipal user);
}