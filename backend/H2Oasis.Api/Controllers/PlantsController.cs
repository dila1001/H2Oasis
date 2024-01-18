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
        public async Task<IActionResult> Post([FromBody] CreatePlantRequest plantRequest)
        {
            var plantResponse = await _plantService.CreatePlant(plantRequest);
            
            return CreatedAtAction(
                nameof(GetPlantById),
                new { id = plantResponse.Id },
                plantResponse);
        }
        
        // // PUT api/<PlantsController>/5
        // [HttpPut("{id}")]
        // public void Put(int id, [FromBody] string value)
        // {
        // }
        //
        // // DELETE api/<PlantsController>/5
        // [HttpDelete("{id}")]
        // public void Delete(int id)
        // {
        // }
    }
}
