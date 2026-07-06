using FPAMS.Application.DTOs.Notification;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;

namespace FPAMS.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly IGenericRepository<Notification> _repository;

    public NotificationService(IGenericRepository<Notification> repository)
    {
        _repository = repository;
    }

    public async Task<List<NotificationResponse>> GetAllAsync()
    {
        var notifications = await _repository.GetAllAsync();

        return notifications.Select(MapToResponse).ToList();
    }

    public async Task<NotificationResponse> CreateAsync(CreateNotificationRequest request)
    {
        var notification = new Notification
        {
            Title = request.Title,
            Message = request.Message,
            Category = request.Category,
            ReferenceId = request.ReferenceId,
            IsRead = false
        };

        await _repository.AddAsync(notification);
        await _repository.SaveChangesAsync();

        return MapToResponse(notification);
    }

    public async Task<NotificationResponse?> MarkReadAsync(Guid id)
    {
        var notification = await _repository.GetByIdAsync(id);

        if (notification == null || notification.IsDeleted)
            return null;

        notification.IsRead = true;
        notification.ModifiedOn = DateTime.UtcNow;

        _repository.Update(notification);
        await _repository.SaveChangesAsync();

        return MapToResponse(notification);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var notification = await _repository.GetByIdAsync(id);

        if (notification == null || notification.IsDeleted)
            return false;

        notification.IsDeleted = true;
        notification.ModifiedOn = DateTime.UtcNow;

        _repository.Update(notification);
        await _repository.SaveChangesAsync();

        return true;
    }

    private static NotificationResponse MapToResponse(Notification notification)
    {
        return new NotificationResponse
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            Category = notification.Category,
            ReferenceId = notification.ReferenceId,
            IsRead = notification.IsRead,
            CreatedOn = notification.CreatedOn
        };
    }
}
