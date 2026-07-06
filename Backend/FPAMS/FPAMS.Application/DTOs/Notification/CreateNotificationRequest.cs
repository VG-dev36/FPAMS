using System.ComponentModel.DataAnnotations;

namespace FPAMS.Application.DTOs.Notification;

public class CreateNotificationRequest
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Category { get; set; } = "General";

    public Guid? ReferenceId { get; set; }
}
