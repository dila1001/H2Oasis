using H2Oasis.Api.Contracts.Plant;
using H2Oasis.Api.Contracts.User;

namespace H2Oasis.Api.Contracts.Household;

public record HouseholdResponse(Guid Id, string Name, IEnumerable<UserResponse>? Users, IEnumerable<PlantResponse>? Plants);