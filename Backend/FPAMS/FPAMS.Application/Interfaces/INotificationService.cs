using FPAMS.Application.DTOs.Notification;

namespace FPAMS.Application.Interfaces;

public interface INotificationService
{
    Task<List<NotificationResponse>> GetAllAsync();

    Task<NotificationResponse> CreateAsync(CreateNotificationRequest request);

    Task<NotificationResponse?> MarkReadAsync(Guid id);

    Task<bool> DeleteAsync(Guid id);
}
