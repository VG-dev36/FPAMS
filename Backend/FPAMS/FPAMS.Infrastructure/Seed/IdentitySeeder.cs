using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Persistence.Context;
using FPAMS.Shared.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FPAMS.Infrastructure.Seed;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        if (!await context.Roles.AnyAsync())
        {
            foreach (var role in Roles.All)
            {
                context.Roles.Add(new Role
                {
                    Name = role,
                    Description = role
                });
            }

            await context.SaveChangesAsync();
        }

        if (await context.Users.AnyAsync())
            return;

        var adminRole = await context.Roles
            .FirstAsync(r => r.Name == Roles.SuperAdmin);

        var admin = new User
        {
            EmployeeCode = "ADMIN001",

            FirstName = "System",

            LastName = "Administrator",

            Email = "admin@fpams.com",

            PasswordHash = passwordHasher.HashPassword("Admin@123"),

            Mobile = "9999999999",

            Designation = "Administrator",

            IsActive = true,

            DepartmentId = null,

            RoleId = adminRole.Id
        };

        context.Users.Add(admin);

        await context.SaveChangesAsync();
    }
}