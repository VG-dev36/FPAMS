using FPAMS.Application.DTOs.Auth;
using FPAMS.Application.Interfaces;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Infrastructure.Authentication;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public AuthService(
        AppDbContext context,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Email == request.Email);

        if (user == null)
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        var valid = _passwordHasher.VerifyPassword(
            request.Password,
            user.PasswordHash);

        if (!valid)
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        var token = _jwtService.GenerateToken(
            user,
            user.Role.Name);

        return new LoginResponse
        {
            Success = true,
            Message = "Login successful.",

            Token = token,

            UserId = user.Id,

            EmployeeCode = user.EmployeeCode,

            FullName = $"{user.FirstName} {user.LastName}",

            Role = user.Role.Name,

            Email = user.Email
        };
    }
}