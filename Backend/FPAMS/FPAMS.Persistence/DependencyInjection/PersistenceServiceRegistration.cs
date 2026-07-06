using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Persistence.Repositories;

namespace FPAMS.Persistence.DependencyInjection;

public static class PersistenceServiceRegistration
{
    public static IServiceCollection AddPersistenceServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddScoped<IUserRepository, UserRepository>();

        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

        services.AddScoped<IDepartmentRepository, DepartmentRepository>();

        services.AddScoped<IAcademicYearRepository, AcademicYearRepository>();

        services.AddScoped<IDesignationRepository, DesignationRepository>();

        services.AddScoped<IGenericRepository<FacultyProfile>, FacultyProfileRepository>();

        services.AddScoped<IGenericRepository<AppraisalForm>, AppraisalFormRepository>();

        services.AddScoped<IGenericRepository<EvidenceAttachment>, EvidenceAttachmentRepository>();

        services.AddScoped<IGenericRepository<Notification>, NotificationRepository>();

        return services;
    }
}
