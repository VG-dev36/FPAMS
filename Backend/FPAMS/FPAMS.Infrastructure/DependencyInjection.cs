using FPAMS.Application.Authentication;
using FPAMS.Application.Interfaces;
using FPAMS.Infrastructure.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FPAMS.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<JwtSettings>(
            configuration.GetSection("Jwt"));

        services.AddScoped<IPasswordHasher, PasswordHasher>();

        services.AddScoped<IJwtService, JwtService>();

        services.AddHttpContextAccessor();

        services.AddScoped<ICurrentUserService, CurrentUserService>();

        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}