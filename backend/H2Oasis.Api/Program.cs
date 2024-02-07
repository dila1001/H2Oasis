using Azure.Storage.Blobs;
using H2Oasis.Api.Persistence;
using H2Oasis.Api.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

{
    builder.Services.AddAuthentication(o =>
        {
            o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        })
        .AddCookie(o =>
        {
            o.Cookie.Name = "H2Oasis";
            o.Cookie.SameSite = SameSiteMode.None;
            o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            o.Cookie.HttpOnly = true;
            o.LoginPath = "/login";
            o.LogoutPath = "/api/auth/logout";
            o.SlidingExpiration = true;
            o.ExpireTimeSpan = TimeSpan.FromHours(24);
        })
        .AddGoogle(googleOptions =>
        {
            if (builder.Environment.IsDevelopment())
            {
                googleOptions.ClientId = configuration["Authentication:Google:ClientId"];
                googleOptions.ClientSecret = configuration["Authentication:Google:ClientSecret"];
            }
            else
            {
                googleOptions.ClientId = Environment.GetEnvironmentVariable("Google_ClientId");
                googleOptions.ClientSecret = Environment.GetEnvironmentVariable("Google_ClientSecret");
            }
            
            googleOptions.CallbackPath = "/api/auth/google/callback";
            googleOptions.SaveTokens = true;
        });
    
    builder.Services.AddControllers();
    builder.Services.AddAutoMapper(typeof(Program).Assembly);
    builder.Services.AddScoped<IPlantService, PlantService>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IHouseholdService, HouseholdService>();
    var connection = builder.Environment.IsDevelopment() ? configuration["ConnectionStrings:AZURE_SQL_CONNECTIONSTRING"] : Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING");
    builder.Services.AddDbContext<PlantDbContext>(options => 
        options.UseSqlServer(connection));
    var blobConnection = builder.Environment.IsDevelopment() ? configuration["Azure:BlobConnString"] : Environment.GetEnvironmentVariable("Azure_Blob_ConnectionString");
    builder.Services.AddScoped<BlobServiceClient>(x => new BlobServiceClient(blobConnection));
    builder.Services.AddScoped<IBlobStorageService, BlobStorageService>();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

var app = builder.Build();

{
    app.Use(async (context, next) =>
    {
        context.Response.GetTypedHeaders().CacheControl = new CacheControlHeaderValue
        {
            NoCache = true
        };
        await next();
    });
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseCors(policy =>
    {
        policy.WithOrigins("http://localhost:5174", "https://ashy-stone-00b16bb03.4.azurestaticapps.net")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
    app.MapControllers();
    app.MapFallbackToFile("index.html");
    app.Run();
}


