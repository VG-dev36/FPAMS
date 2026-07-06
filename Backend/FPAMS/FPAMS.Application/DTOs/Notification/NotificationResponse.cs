namespace FPAMS.Application.DTOs.Notification;

public class NotificationResponse
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public Guid? ReferenceId { get; set; }

    public bool IsRead { get; set; }

    public DateTime CreatedOn { get; set; }
}
