using AutoMapper;
using H2Oasis.Api.Contracts.Household;
using H2Oasis.Api.Contracts.Plant;
using H2Oasis.Api.Contracts.User;
using H2Oasis.Api.Models;

namespace H2Oasis.Api;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Plant, PlantResponse>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.PlantId))
            .ForCtorParam("Id", opt => opt.MapFrom(src => src.PlantId));
        CreateMap<User, UserResponse>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.UserId))
            .ForCtorParam("Id", opt => opt.MapFrom(src => src.UserId));
        CreateMap<Household, HouseholdResponse>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.HouseholdId))
            .ForMember(dest => dest.Users, opt => opt.MapFrom(src => src.UserHouseholds.Select(uh => uh.User)))
            .ForMember(dest => dest.AdminId, opt => opt.MapFrom(src => src.AdminId))  
            .ConstructUsing(src => new HouseholdResponse(src.HouseholdId, src.Name, src.AdminId,null, null));
    }
}