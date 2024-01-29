using H2Oasis.Api.Persistence;
using H2Oasis.Api.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Supabase;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

{
    // builder.Services.AddAuthentication(o =>
    //     {
    //         o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    //     })
    //     .AddCookie(o =>
    //     {
    //         o.Cookie.Name = "H2Oasis";
    //         // o.LoginPath = "/api/auth/google";
    //         o.LogoutPath = "/api/auth/logout";
    //         o.SlidingExpiration = true;
    //         o.ExpireTimeSpan = TimeSpan.FromHours(24);
    //     })
    //     .AddGoogle(googleOptions =>
    //     {
    //         googleOptions.ClientId = configuration["Authentication:Google:ClientId"];
    //         googleOptions.ClientSecret = configuration["Authentication:Google:ClientSecret"];
    //         googleOptions.CallbackPath = "/api/auth/google/callback";
    //         googleOptions.SaveTokens = true;
    //     });
    
    // builder.Services.AddScoped<Supabase.Client>(_ =>
    //     new Supabase.Client(
    //         "https://ivbbntffeagohrxodyub.supabase.co",
    //         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YmJudGZmZWFnb2hyeG9keXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0ODk4NDksImV4cCI6MjAyMTA2NTg0OX0.xnXBonjjMdG7kcyC10y7AuwlD-1IEp2nm9Zx64C_7SE",
    //         new SupabaseOptions()
    //         {
    //             AutoRefreshToken = true,
    //             AutoConnectRealtime = true
    //         }));
    
    builder.Services.AddControllers();
    builder.Services.AddAutoMapper(typeof(Program).Assembly);
    builder.Services.AddScoped<IPlantService, PlantService>();
    // builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddDbContext<PlantDbContext>(options => 
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

var app = builder.Build();

{

    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHttpsRedirection();
    app.UseCors(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader(); 
    });
    app.MapControllers();
    app.Run();
}


