using AutoMapper;
using H2Oasis.Api.Contracts.Plant;
using H2Oasis.Api.Models;

namespace H2Oasis.Api;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Plant, PlantResponse>();
    }
}