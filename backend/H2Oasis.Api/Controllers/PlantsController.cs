using AutoMapper;
using H2Oasis.Api.Contracts.Plant;
using H2Oasis.Api.Models;
using H2Oasis.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace H2Oasis.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class PlantsController : ControllerBase
    {
        private readonly IPlantService _plantService;
        private readonly IMapper _mapper;
        
        public PlantsController(IPlantService plantService, IMapper mapper)
        {
            _plantService = plantService;
            _mapper = mapper;
        }
        
        [HttpGet("households/{householdId:guid}")]
        public async Task<IActionResult> GetPlantsForHousehold(Guid householdId)
        {
            var plants = await _plantService.GetPlantsForHousehold(householdId);

            if (plants is null)
            {
                return NotFound($"No household with the id: {householdId}");
            }
            
            var plantResponses = _mapper.Map<IEnumerable<PlantResponse>>(plants);
            
            return Ok(plantResponses);
        }
        
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetPlantById(Guid id)
        {
            var plant = await _plantService.GetPlantById(id);

            if (plant is null)
            {
                return NotFound($"No plant with the id: {id}");
            }

            var plantResponse = _mapper.Map<PlantResponse>(plant);

            return Ok(plantResponse);
        }
        
        [HttpPost]
        public async Task<IActionResult> PostPlant([FromBody] CreatePlantRequest plantRequest)
        {
            Plant newPlant = Plant.From(plantRequest);
            
            var plant = await _plantService.CreatePlantForHousehold(newPlant);
            
            var plantResponse = _mapper.Map<PlantResponse>(plant);
            
            return CreatedAtAction(
                nameof(GetPlantById),
                new { id = plantResponse.PlantId },
                plantResponse);
        }
        
        [HttpPut("{id:guid}")]
        public  async Task<IActionResult> UpdatePlant(Guid id, [FromBody] UpdatePlantRequest request)
        {
            Plant updatedPlant = Plant.From(id, request);
            
            var plant = await _plantService.UpdatePlant(updatedPlant);

            if (plant is null)
            {
                return NotFound($"No plant with the id: {id}");
            }
            
            var plantResponse = _mapper.Map<PlantResponse>(plant);

            return Ok(plantResponse);

        }
        
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _plantService.DeletePlant(id);

            if (!result)
            {
                return NotFound($"No plant with the id: {id}");
            }

            return NoContent();
        }
    }
}
