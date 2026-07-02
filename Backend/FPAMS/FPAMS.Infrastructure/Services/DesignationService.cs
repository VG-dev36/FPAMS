using FPAMS.Application.DTOs.Designation;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;

namespace FPAMS.Infrastructure.Services;

public class DesignationService
{
    private readonly IDesignationRepository _repository;

    public DesignationService(IDesignationRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<DesignationResponse>> GetAllAsync()
    {
        var list = await _repository.GetAllAsync();

        return list
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new DesignationResponse
            {
                Id = x.Id,
                DesignationCode = x.DesignationCode,
                DesignationName = x.DesignationName,
                Description = x.Description,
                DisplayOrder = x.DisplayOrder,
                IsActive = x.IsActive
            });
    }

    public async Task<DesignationResponse?> GetByIdAsync(Guid id)
    {
        var designation = await _repository.GetByIdAsync(id);

        if (designation == null || designation.IsDeleted)
            return null;

        return new DesignationResponse
        {
            Id = designation.Id,
            DesignationCode = designation.DesignationCode,
            DesignationName = designation.DesignationName,
            Description = designation.Description,
            DisplayOrder = designation.DisplayOrder,
            IsActive = designation.IsActive
        };
    }

    public async Task<DesignationResponse> CreateAsync(CreateDesignationRequest request)
    {
        if (await _repository.CodeExistsAsync(request.DesignationCode))
            throw new Exception("Designation Code already exists.");

        if (await _repository.NameExistsAsync(request.DesignationName))
            throw new Exception("Designation Name already exists.");

        var entity = new Designation
        {
            DesignationCode = request.DesignationCode,
            DesignationName = request.DesignationName,
            Description = request.Description,
            DisplayOrder = request.DisplayOrder,
            IsActive = true
        };

        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();

        return new DesignationResponse
        {
            Id = entity.Id,
            DesignationCode = entity.DesignationCode,
            DesignationName = entity.DesignationName,
            Description = entity.Description,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        };
    }

    public async Task<bool> UpdateAsync(UpdateDesignationRequest request)
    {
        var entity = await _repository.GetByIdAsync(request.Id);

        if (entity == null || entity.IsDeleted)
            return false;

        entity.DesignationCode = request.DesignationCode;
        entity.DesignationName = request.DesignationName;
        entity.Description = request.Description;
        entity.DisplayOrder = request.DisplayOrder;
        entity.IsActive = request.IsActive;

        _repository.Update(entity);
        await _repository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);

        if (entity == null || entity.IsDeleted)
            return false;

        entity.IsDeleted = true;

        _repository.Update(entity);

        await _repository.SaveChangesAsync();

        return true;
    }
}