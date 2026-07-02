using FPAMS.Application.DTOs.AcademicYear;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;

namespace FPAMS.Infrastructure.Services;

public class AcademicYearService : IAcademicYearService
{
    private readonly IAcademicYearRepository _repository;

    public AcademicYearService(IAcademicYearRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AcademicYearResponse>> GetAllAsync()
    {
        var years = await _repository.GetAllAsync();

        return years.Select(x => new AcademicYearResponse
        {
            Id = x.Id,
            YearName = x.YearName,
            StartDate = x.StartDate,
            EndDate = x.EndDate,
            IsCurrent = x.IsCurrent,
            IsActive = x.IsActive
        }).ToList();
    }

    public async Task<AcademicYearResponse?> GetByIdAsync(Guid id)
    {
        var x = await _repository.GetByIdAsync(id);

        if (x == null)
            return null;

        return new AcademicYearResponse
        {
            Id = x.Id,
            YearName = x.YearName,
            StartDate = x.StartDate,
            EndDate = x.EndDate,
            IsCurrent = x.IsCurrent,
            IsActive = x.IsActive
        };
    }

    public async Task<AcademicYearResponse> CreateAsync(CreateAcademicYearRequest request)
    {
        if (await _repository.ExistsAsync(request.YearName))
            throw new Exception("Academic Year already exists.");

        if (request.IsCurrent)
        {
            var current = await _repository.GetCurrentAsync();

            if (current != null)
            {
                current.IsCurrent = false;
                _repository.Update(current);
            }
        }

        var entity = new AcademicYear
        {
            YearName = request.YearName,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsCurrent = request.IsCurrent,
            IsActive = true
        };

        await _repository.AddAsync(entity);

        await _repository.SaveChangesAsync();

        return await GetByIdAsync(entity.Id)!;
    }

    public async Task<AcademicYearResponse?> UpdateAsync(UpdateAcademicYearRequest request)
    {
        var entity = await _repository.GetByIdAsync(request.Id);

        if (entity == null)
            return null;

        if (request.IsCurrent)
        {
            var current = await _repository.GetCurrentAsync();

            if (current != null && current.Id != entity.Id)
            {
                current.IsCurrent = false;
                _repository.Update(current);
            }
        }

        entity.YearName = request.YearName;
        entity.StartDate = request.StartDate;
        entity.EndDate = request.EndDate;
        entity.IsCurrent = request.IsCurrent;
        entity.IsActive = request.IsActive;

        _repository.Update(entity);

        await _repository.SaveChangesAsync();

        return await GetByIdAsync(entity.Id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);

        if (entity == null)
            return false;

        _repository.Delete(entity);

        await _repository.SaveChangesAsync();

        return true;
    }
}