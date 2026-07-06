using FPAMS.Application.DTOs.User;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(
        AppDbContext context,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<List<UserResponse>> GetAllAsync()
    {
        return await _context.Users
            .Include(x => x.Department)
            .Include(x => x.Designation)
            .Include(x => x.Role)
            .Where(x => !x.IsDeleted)
            .Select(x => new UserResponse
            {
                Id = x.Id,
                EmployeeCode = x.EmployeeCode,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email,
                Mobile = x.Mobile,
                DepartmentId = x.DepartmentId,

                Department = x.Department != null
                    ? x.Department.DepartmentName
                    : "",

                DesignationId = x.DesignationId,

                Designation = x.Designation != null
                    ? x.Designation.DesignationName
                    : "",

                RoleId = x.RoleId,

                Role = x.Role != null
                    ? x.Role.Name
                    : "",

                IsActive = x.IsActive
            })
            .ToListAsync();
    }

    public async Task<UserResponse?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(x => x.Department)
            .Include(x => x.Designation)
            .Include(x => x.Role)
            .Where(x => x.Id == id && !x.IsDeleted)
            .Select(x => new UserResponse
            {
                Id = x.Id,
                EmployeeCode = x.EmployeeCode,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email,
                Mobile = x.Mobile,
                DepartmentId = x.DepartmentId,

                Department = x.Department != null
                    ? x.Department.DepartmentName
                    : "",

                DesignationId = x.DesignationId,

                Designation = x.Designation != null
                    ? x.Designation.DesignationName
                    : "",

                RoleId = x.RoleId,

                Role = x.Role != null
                    ? x.Role.Name
                    : "",

                IsActive = x.IsActive
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserResponse> CreateAsync(CreateUserRequest request)
    {
        var user = new User
        {
            EmployeeCode = request.EmployeeCode,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Mobile = request.Mobile,

            PasswordHash = _passwordHasher.HashPassword(request.Password),

            DepartmentId = request.DepartmentId,
            DesignationId = request.DesignationId,
            RoleId = request.RoleId,

            IsActive = true
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(user.Id)
            ?? throw new Exception("User creation failed.");
    }

    public async Task<UserResponse> UpdateAsync(UpdateUserRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == request.Id);

        if (user == null)
            throw new Exception("User not found.");

        user.EmployeeCode = request.EmployeeCode;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.Mobile = request.Mobile;

        user.DepartmentId = request.DepartmentId;
        user.DesignationId = request.DesignationId;
        user.RoleId = request.RoleId;

        user.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(user.Id)
            ?? throw new Exception("User update failed.");
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return false;

        user.IsDeleted = true;

        await _context.SaveChangesAsync();

        return true;
    }
}
