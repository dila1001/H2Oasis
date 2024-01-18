// using System.Security.Claims;
// using H2Oasis.Api.Services;
// using Microsoft.AspNetCore.Authentication;
// using Microsoft.AspNetCore.Authentication.Cookies;
// using Microsoft.AspNetCore.Authentication.Google;
// using Microsoft.AspNetCore.Mvc;
//
// namespace GoogleAuth.Api.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class AuthController : ControllerBase
//     {
//         private readonly IUserService _userService;
//
//         public AuthController(IUserService userService)
//         {
//             _userService = userService;
//         }
//
//         [HttpGet("google")]
//         [HttpGet("google/callback")]
//         public async Task<IActionResult> GoogleCallback(string returnUrl)
//         {
//             var authenticateResult = await Request.HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
//             
//             if (!authenticateResult.Succeeded)
//             {
//                 return new ChallengeResult(GoogleDefaults.AuthenticationScheme);
//             }
//
//             // var userInfo = _userService.GetUserInfo(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
//             //
//             // if (userInfo is null)
//             // {
//             //     userInfo = _userService.CreateUserFromClaims(User);
//             // }
//             
//             // map userInfo to userResponse
//             
//             // return Ok(new { message = "Login successful" }); // return userResponse here
//             return LocalRedirect(returnUrl);
//         }
//         
//         [HttpGet("logout")]
//         public IActionResult Logout()
//         {
//             HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
//             HttpContext.SignOutAsync(GoogleDefaults.AuthenticationScheme);
//             
//             return Ok();
//         }
//     }
// }