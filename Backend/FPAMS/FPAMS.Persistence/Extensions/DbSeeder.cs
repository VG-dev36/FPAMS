using FPAMS.Domain.Entities;
using FPAMS.Persistence.Context;
using FPAMS.Shared.Constants;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Persistence.Extensions;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await SeedRoles(context);
    }

    private static async Task SeedRoles(AppDbContext context)
    {
        if (await context.Roles.AnyAsync())
            return;

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
}