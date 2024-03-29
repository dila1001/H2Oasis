using AutoMapper;
using H2Oasis.Api.Contracts.Household;
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
    public class HouseholdsController : ControllerBase
    {
        private readonly IHouseholdService _householdService;
        private readonly IMapper _mapper;

        public HouseholdsController(IHouseholdService householdService, IMapper mapper)
        {
            _householdService = householdService;
            _mapper = mapper;
        }
        
        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetHouseholdsForUser(string userId)
        {
            var households = await _householdService.GetHouseholdsForUser(userId);
            
            var householdsResponse = _mapper.Map<IEnumerable<HouseholdResponse>>(households);
            
            return Ok(householdsResponse);
        }
        
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetHouseholdById(Guid id)
        {
            var household = await _householdService.GetHouseholdById(id);

            if (household is null)
            {
                return NotFound($"No household with the id: {id}");
            }
            
            var householdResponse = _mapper.Map<HouseholdResponse>(household);

            return Ok(householdResponse);
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateHousehold([FromBody] CreateHouseholdRequest householdRequest)
        {
            var newHousehold = new Household()
            {
                Name = householdRequest.Name,
                AdminId = householdRequest.UserId
            };

            var household = await _householdService.CreateHousehold(newHousehold);
            
            var result= await _householdService.AddUserToHousehold(householdRequest.UserId, household.HouseholdId);

            if (!result)
            {
                return NotFound($"No user with the id: {householdRequest.UserId}");
            }
            
            var householdResponse = _mapper.Map<HouseholdResponse>(household);
            
            return CreatedAtAction(
                nameof(GetHouseholdById),
                new { id = householdResponse.Id },
                householdResponse);

        }
        
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateHouseHold(Guid id, [FromBody] UpdateHouseholdRequest request)
        {
            var updatedHousehold = new Household()
            {
                HouseholdId = id,
                Name = request.Name
            };

            var household = await _householdService.UpdateHouseHold(updatedHousehold);
            
            if (household is null)
            {
                return NotFound($"No household with the id: {id}");
            }
            
            var householdResponse = _mapper.Map<HouseholdResponse>(household);

            return Ok(householdResponse);
        }
        
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteHousehold(Guid id)
        {
            var result = await _householdService.DeleteHousehold(id);
            
            if (!result)
            {
                return NotFound($"No household with the id: {id}");
            }

            return NoContent();
        }
        
        [HttpDelete("{householdId:guid}/users/{userId}")]
        public async Task<IActionResult> DeleteUserFromHousehold(Guid householdId, string userId)
        {
            var result = await _householdService.RemoveUserFromHousehold(userId, householdId);
            
            if (!result)
            {
                return NotFound($"User {userId} is not associated with household {householdId}");
            }

            return NoContent();
        }
        
        [HttpPost("{householdId:guid}/users/{userId}")]
        public async Task<IActionResult> AddUserToHousehold(Guid householdId, string userId)
        {
            var result = await _householdService.AddUserToHousehold(userId, householdId);
            
            if (!result)
            {
                return NotFound($"No user with id {userId} or household with id {householdId}");
            }

            return NoContent();
        }
    }
}
