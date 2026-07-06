using FPAMS.Application.DTOs.User;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Infrastructure.Authentication;
using FPAMS.Infrastructure.Services;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Tests;

public class UserServiceTests
{
    [Fact]
    public async Task GetAllAsync_ReturnsLookupIdsNeededForEditing()
    {
        await using var context = CreateContext();
        var role = new Role
        {
            Id = Guid.NewGuid(),
            Name = "FACULTY",
            Description = "Faculty"
        };
        var department = new Department
        {
            Id = Guid.NewGuid(),
            DepartmentCode = "CSE",
            DepartmentName = "Computer Science and Engineering",
            IsActive = true
        };
        var designation = new Designation
        {
            Id = Guid.NewGuid(),
            DesignationCode = "AP",
            DesignationName = "Assistant Professor",
            IsActive = true
        };
        var user = new User
        {
            Id = Guid.NewGuid(),
            EmployeeCode = "FAC100",
            FirstName = "Test",
            LastName = "Faculty",
            Email = "faculty100@fpams.test",
            Mobile = "9999999999",
            PasswordHash = "hash",
            RoleId = role.Id,
            Role = role,
            DepartmentId = department.Id,
            Department = department,
            DesignationId = designation.Id,
            Designation = designation,
            IsActive = true
        };

        context.Roles.Add(role);
        context.Departments.Add(department);
        context.Designations.Add(designation);
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new UserService(context, new FakePasswordHasher());

        var result = await service.GetAllAsync();

        var response = Assert.Single(result);
        Assert.Equal(department.Id, response.DepartmentId);
        Assert.Equal(designation.Id, response.DesignationId);
        Assert.Equal(role.Id, response.RoleId);
        Assert.Equal(department.DepartmentName, response.Department);
        Assert.Equal(designation.DesignationName, response.Designation);
        Assert.Equal(role.Name, response.Role);
    }

    [Fact]
    public async Task GetAllAsync_ExcludesSoftDeletedUsers()
    {
        await using var context = CreateContext();
        var active = CreateUser("active@fpams.test");
        var deleted = CreateUser("deleted@fpams.test");
        deleted.IsDeleted = true;

        context.Users.AddRange(active, deleted);
        await context.SaveChangesAsync();

        var service = new UserService(context, new FakePasswordHasher());

        var result = await service.GetAllAsync();

        var response = Assert.Single(result);
        Assert.Equal(active.Id, response.Id);
    }

    [Fact]
    public async Task LoginAsync_RejectsDeletedOrInactiveUsers()
    {
        await using var context = CreateContext();
        var deleted = CreateUser("deleted@fpams.test");
        deleted.IsDeleted = true;
        var inactive = CreateUser("inactive@fpams.test");
        inactive.IsActive = false;
        context.Users.AddRange(deleted, inactive);
        await context.SaveChangesAsync();

        var service = new AuthService(
            context,
            new FakePasswordHasher(),
            new FakeJwtService());

        var deletedResult = await service.LoginAsync(new()
        {
            Email = deleted.Email,
            Password = "password"
        });
        var inactiveResult = await service.LoginAsync(new()
        {
            Email = inactive.Email,
            Password = "password"
        });

        Assert.False(deletedResult.Success);
        Assert.False(inactiveResult.Success);
    }

    [Fact]
    public async Task RoleService_ReturnsOnlyActiveRolesInNameOrder()
    {
        await using var context = CreateContext();
        context.Roles.AddRange(
            new Role
            {
                Id = Guid.NewGuid(),
                Name = "PRINCIPAL",
                Description = "Principal"
            },
            new Role
            {
                Id = Guid.NewGuid(),
                Name = "APEC",
                Description = "APEC"
            },
            new Role
            {
                Id = Guid.NewGuid(),
                Name = "OLD",
                Description = "Deleted",
                IsDeleted = true
            });
        await context.SaveChangesAsync();

        var service = new RoleService(context);

        var result = await service.GetAllAsync();

        Assert.Collection(
            result,
            role => Assert.Equal("APEC", role.Name),
            role => Assert.Equal("PRINCIPAL", role.Name));
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static User CreateUser(string email)
    {
        var role = new Role
        {
            Id = Guid.NewGuid(),
            Name = "FACULTY",
            Description = "Faculty"
        };

        return new User
        {
            Id = Guid.NewGuid(),
            EmployeeCode = $"EMP{Guid.NewGuid():N}"[..8],
            FirstName = "Test",
            LastName = "User",
            Email = email,
            Mobile = "9999999999",
            PasswordHash = "hashed:password",
            RoleId = role.Id,
            Role = role,
            IsActive = true
        };
    }

    private sealed class FakePasswordHasher : IPasswordHasher
    {
        public string HashPassword(string password) => $"hashed:{password}";

        public bool VerifyPassword(string password, string passwordHash) =>
            passwordHash == HashPassword(password);
    }

    private sealed class FakeJwtService : IJwtService
    {
        public string GenerateToken(User user, string role) => $"token:{user.Id}:{role}";
    }
}
