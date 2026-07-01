using FPAMS.Application.DTOs.Auth;
using FPAMS.Application.Interfaces;

namespace FPAMS.Infrastructure.Authentication;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;

    private readonly IPasswordHasher _passwordHasher;

    private readonly IJwtService _jwt;

    public AuthService(
        IUserRepository users,
        IPasswordHasher passwordHasher,
        IJwtService jwt)
    {
        _users = users;
        _passwordHasher = passwordHasher;
        _jwt = jwt;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _users.GetByEmailAsync(request.Email);

        if (user == null)
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        if (!_passwordHasher.VerifyPassword(
                request.Password,
                user.PasswordHash))
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        var token = _jwt.GenerateToken(
            user,
            user.Role!.Name);

        return new LoginResponse
        {
            Success = true,

            Token = token,

            Email = user.Email,

            FullName = $"{user.FirstName} {user.LastName}",

            Role = user.Role.Name,

            ExpiresOn = DateTime.UtcNow.AddHours(24),

            Message = "Login Successful."
        };
    }
}