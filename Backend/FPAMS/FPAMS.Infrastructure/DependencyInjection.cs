using FPAMS.Application.Interfaces;
using FPAMS.Infrastructure.Authentication;
using FPAMS.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FPAMS.Infrastructure.Services;

namespace FPAMS.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<JwtSettings>(
            configuration.GetSection("Jwt"));

        services.AddHttpContextAccessor();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme =
                JwtBearerDefaults.AuthenticationScheme;

            options.DefaultChallengeScheme =
                JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters =
                new TokenValidationParameters
                {
                    ValidateIssuer = true,

                    ValidateAudience = true,

                    ValidateLifetime = true,

                    ValidateIssuerSigningKey = true,

                    ValidIssuer = configuration["Jwt:Issuer"],

                    ValidAudience = configuration["Jwt:Audience"],

                    IssuerSigningKey =
                        new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(
                                configuration["Jwt:Key"]!))
                };
        });

        services.AddAuthorization();

        services.AddScoped<IPasswordHasher, PasswordHasher>();

        services.AddScoped<IJwtService, JwtService>();

        services.AddScoped<ICurrentUserService, CurrentUserService>();

        services.AddScoped<IAuthService, AuthService>();

        services.AddScoped<IDepartmentService, DepartmentService>();

        return services;
    }
}