using FPAMS.Application.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace FPAMS.Infrastructure.Authentication;

public class PasswordHasher : IPasswordHasher
{
    private readonly Microsoft.AspNetCore.Identity.PasswordHasher<object> _hasher = new();

    public string HashPassword(string password)
    {
        return _hasher.HashPassword(null!, password);
    }

    public bool VerifyPassword(string password, string hash)
    {
        var result = _hasher.VerifyHashedPassword(null!, hash, password);

        return result == PasswordVerificationResult.Success ||
               result == PasswordVerificationResult.SuccessRehashNeeded;
    }
}