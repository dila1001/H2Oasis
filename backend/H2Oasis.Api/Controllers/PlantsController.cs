using AutoMapper;
using H2Oasis.Api.Contracts.Plant;
using H2Oasis.Api.Models;
using H2Oasis.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;


namespace H2Oasis.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class PlantsController : ControllerBase
    {
        private readonly IPlantService _plantService;
        private readonly IMapper _mapper;
        private readonly IBlobStorageService _mappeBlobStorageService;
        
        public PlantsController(IPlantService plantService, IMapper mapper, IBlobStorageService mappeBlobStorageService)
        {
            _plantService = plantService;
            _mapper = mapper;
            _mappeBlobStorageService = mappeBlobStorageService;
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
        
        [HttpGet("{id:guid}/image")]
        public async Task<IActionResult> GetPlantImage(Guid id)
        {
            var plant = await _plantService.GetPlantById(id);

            if (plant is null)
            {
                return NotFound($"No plant with the id: {id}");
            }

            var imageData = await _mappeBlobStorageService.GetBlob(plant.PlantId.ToString());
            
            var image = Image.Load(imageData);
            return File(imageData, image.Metadata.DecodedImageFormat?.DefaultMimeType);
        }
        
        [HttpPost("households/{householdId:guid}")]
        public async Task<IActionResult> PostPlant(Guid householdId, [FromForm] CreatePlantRequest plantRequest)
        {
            var newPlant = Plant.From(plantRequest);

            if (plantRequest.Image is { Length: > 0 })
            {
                newPlant.ImageUrl = await SaveImage(newPlant.PlantId, plantRequest.Image);
            }
            newPlant.HouseholdId = householdId;
            var plant = await _plantService.CreatePlantForHousehold(newPlant);
            var plantResponse = _mapper.Map<PlantResponse>(plant);
            
            return CreatedAtAction(
                nameof(GetPlantById),
                new { id = plantResponse.Id },
                plantResponse);
        }
        
        [HttpPut("{plantId:guid}/households/{householdId:guid}")]
        public  async Task<IActionResult> UpdatePlant(Guid plantId, Guid householdId, [FromForm] UpdatePlantRequest request)
        {
            var updatePlant = Plant.From(plantId, householdId, request);
   
            if (request.Image is not null)
            {
                updatePlant.ImageUrl = await SaveImage(plantId, request.Image);
            }
            
            var plant = await _plantService.UpdatePlant(updatePlant);
            
            if (plant is null)
            {
                return NotFound($"No plant with the id: {plantId}");
            }
            
            var plantResponse = _mapper.Map<PlantResponse>(plant);
            
            return Ok(plantResponse);

        }
        private async Task<string> SaveImage(Guid plantId, IFormFile formFile)
        {
            using var stream = new MemoryStream();
            await formFile.CopyToAsync(stream);
            stream.Position = 0;
            await _mappeBlobStorageService.UploadToBlobStorage(stream, plantId.ToString());
            return $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/api/plants/{plantId}/image";
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
