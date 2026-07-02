using FPAMS.Application.DTOs.Department;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;

namespace FPAMS.Infrastructure.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _repository;

    public DepartmentService(IDepartmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<DepartmentResponse>> GetAllAsync()
    {
        var departments = await _repository.GetAllAsync();

        return departments.Select(x => new DepartmentResponse
        {
            Id = x.Id,
            DepartmentCode = x.DepartmentCode,
            DepartmentName = x.DepartmentName,
            IsActive = x.IsActive
        }).ToList();
    }

    public async Task<DepartmentResponse?> GetByIdAsync(Guid id)
    {
        var department = await _repository.GetByIdAsync(id);

        if (department == null)
            return null;

        return new DepartmentResponse
        {
            Id = department.Id,
            DepartmentCode = department.DepartmentCode,
            DepartmentName = department.DepartmentName,
            IsActive = department.IsActive
        };
    }

    public async Task<DepartmentResponse> CreateAsync(CreateDepartmentRequest request)
    {
        var exists = await _repository.GetByCodeAsync(request.DepartmentCode);

        if (exists != null)
            throw new Exception("Department code already exists.");

        var department = new Department
        {
            DepartmentCode = request.DepartmentCode,
            DepartmentName = request.DepartmentName,
            IsActive = request.IsActive
        };

        await _repository.AddAsync(department);
        await _repository.SaveChangesAsync();

        return new DepartmentResponse
        {
            Id = department.Id,
            DepartmentCode = department.DepartmentCode,
            DepartmentName = department.DepartmentName,
            IsActive = department.IsActive
        };
    }

    public async Task<DepartmentResponse?> UpdateAsync(UpdateDepartmentRequest request)
    {
        var department = await _repository.GetByIdAsync(request.Id);

        if (department == null)
            return null;

        department.DepartmentCode = request.DepartmentCode;
        department.DepartmentName = request.DepartmentName;
        department.IsActive = request.IsActive;

        _repository.Update(department);

        await _repository.SaveChangesAsync();

        return new DepartmentResponse
        {
            Id = department.Id,
            DepartmentCode = department.DepartmentCode,
            DepartmentName = department.DepartmentName,
            IsActive = department.IsActive
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var department = await _repository.GetByIdAsync(id);

        if (department == null)
            return false;

        _repository.Delete(department);

        await _repository.SaveChangesAsync();

        return true;
    }
}