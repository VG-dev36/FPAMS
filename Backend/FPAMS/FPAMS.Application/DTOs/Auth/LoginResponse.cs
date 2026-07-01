namespace FPAMS.Application.DTOs.Auth;

public class LoginResponse
{
    public bool Success { get; set; }

    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresOn { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}