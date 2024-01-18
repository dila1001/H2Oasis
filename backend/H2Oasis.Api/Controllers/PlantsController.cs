using System.Text.Json;
using H2Oasis.Api.Contracts.Plant;
using H2Oasis.Api.Contracts.User;
using H2Oasis.Api.Models;
using H2Oasis.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Supabase;

namespace H2Oasis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantsController : ControllerBase
    {
        private readonly IPlantService _plantService;
        
        public PlantsController(IPlantService plantService)
        {
            _plantService = plantService;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetPlants()
        {
            var plantsResponse = await _plantService.GetPlants();
            
            return Ok(plantsResponse);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlantById(int id)
        {
            var plantResponse = await _plantService.GetPlantById(id);
            
            if (plantResponse is null)
                return NotFound($"No plant with the id: {id}");

            return Ok(plantResponse);
        }
        
        [HttpPost]
        public async Task<IActionResult> PostPlant([FromBody] CreatePlantRequest plantRequest)
        {
            var plantResponse = await _plantService.CreatePlant(plantRequest);
            
            return CreatedAtAction(
                nameof(GetPlantById),
                new { id = plantResponse.Id },
                plantResponse);
        }
        
        [HttpPut("{id}")]
        public  async Task<IActionResult> UpdatePlant(int id, [FromBody] UpdatePlantRequest request)
        {
            var plantResponse = await _plantService.UpdatePlant(id, request);
            
            if (plantResponse is null)
                return NotFound($"No plant with the id: {id}");

            return Ok(plantResponse);

        }
        
        // // DELETE api/<PlantsController>/5
        // [HttpDelete("{id}")]
        // public void Delete(int id)
        // {
        // }
    }
}
