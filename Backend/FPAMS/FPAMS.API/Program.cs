using FPAMS.API.Middleware;
using FPAMS.Infrastructure;
using FPAMS.Infrastructure.Seed;
using FPAMS.Persistence.DependencyInjection;
using FPAMS.Persistence.Extensions;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.OpenApi.Models;

namespace FPAMS.API;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Logging.ClearProviders();
        builder.Logging.AddConsole();

        builder.Services.AddControllers();

        builder.Services.AddDataProtection()
            .PersistKeysToFileSystem(
                new DirectoryInfo(
                    Path.Combine(
                        builder.Environment.ContentRootPath,
                        "App_Data",
                        "DataProtectionKeys")));

        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1",
                new OpenApiInfo
                {
                    Title = "FPAMS API",
                    Version = "v1"
                });

            options.AddSecurityDefinition(
                "Bearer",
                new OpenApiSecurityScheme
                {
                    Name = "Authorization",

                    Type = SecuritySchemeType.Http,

                    Scheme = "Bearer",

                    BearerFormat = "JWT",

                    In = ParameterLocation.Header,

                    Description = "Enter JWT Token"
                });

            options.AddSecurityRequirement(
                new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference =
                                new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                        },
                        Array.Empty<string>()
                    }
                });
        });

        builder.Services.AddPersistenceServices(builder.Configuration);

        builder.Services.AddInfrastructure(builder.Configuration);

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll",
                policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
        });

        var app = builder.Build();

        app.UseMiddleware<GlobalExceptionMiddleware>();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();

            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseCors("AllowAll");

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        if (builder.Configuration.GetValue("Database:ApplyMigrationsOnStartup", true))
        {
            await DatabaseInitializer.InitialiseAsync(app.Services);

            await IdentitySeeder.SeedAsync(app.Services);
        }

        app.Run();     

    }
}
