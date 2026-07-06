using FPAMS.Application.DTOs.Appraisal;

namespace FPAMS.Application.Interfaces;

public interface IAppraisalFormService
{
    Task<List<AppraisalFormResponse>> GetAllAsync();

    Task<AppraisalFormResponse?> GetByIdAsync(Guid id);

    Task<AppraisalFormResponse> CreateAsync(CreateAppraisalFormRequest request);

    Task<AppraisalFormResponse?> UpdateAsync(UpdateAppraisalFormRequest request);

    Task<AppraisalFormResponse?> SubmitAsync(Guid id);

    Task<AppraisalFormResponse?> ReviewAsync(Guid id, string status, ReviewAppraisalRequest request);

    Task<bool> DeleteAsync(Guid id);
}
