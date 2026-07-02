namespace FPAMS.Application.DTOs.Designation;

public class UpdateDesignationRequest
{
    public Guid Id { get; set; }

    public string DesignationCode { get; set; } = string.Empty;

    public string DesignationName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; }
}