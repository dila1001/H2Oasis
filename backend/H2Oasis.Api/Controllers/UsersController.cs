using AutoMapper;
using H2Oasis.Api.Contracts.User;
using H2Oasis.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace H2Oasis.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UsersController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userService.GetUserInfo(id);

            if (user is null)
            {
                return NotFound($"No user with the id: {id}");
            }
            
            var userResponse = _mapper.Map<UserResponse>(user);
            return Ok(userResponse);
        }
        
    }
}
