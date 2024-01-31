using H2Oasis.Api.Contracts.Plant;

namespace H2Oasis.Api.Contracts.User;

public record UserResponse(
    string UserId,
    string FirstName,
    string LastName,
    string Email
    );