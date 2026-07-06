using FPAMS.API.Controllers;
using FPAMS.Shared.Constants;
using Microsoft.AspNetCore.Authorization;

namespace FPAMS.Tests;

public class ApiAuthorizationTests
{
    [Theory]
    [InlineData(typeof(DepartmentController), Roles.SuperAdmin)]
    [InlineData(typeof(DesignationController), Roles.SuperAdmin)]
    [InlineData(typeof(AcademicYearController), Roles.SuperAdmin)]
    [InlineData(typeof(UserController), Roles.SuperAdmin)]
    [InlineData(typeof(RoleController), Roles.SuperAdmin)]
    public void MasterDataControllers_AreRestrictedToSuperAdmin(Type controllerType, string expectedRoles)
    {
        AssertRoles(controllerType, expectedRoles);
    }

    [Fact]
    public void FacultyProfileController_IsRestrictedToAdministrativeReviewRoles()
    {
        AssertRoles(
            typeof(FacultyProfileController),
            Roles.SuperAdmin,
            Roles.Principal,
            Roles.HOD);
    }

    [Fact]
    public void EvidenceAndNotificationControllers_AreRestrictedToFpamsRoles()
    {
        var allOperationalRoles = new[]
        {
            Roles.SuperAdmin,
            Roles.Faculty,
            Roles.HOD,
            Roles.Principal,
            Roles.APEC
        };

        AssertRoles(typeof(EvidenceAttachmentController), allOperationalRoles);
        AssertRoles(typeof(NotificationController), allOperationalRoles);
    }

    [Fact]
    public void AppraisalFormController_HasExpectedWorkflowRoleRestrictions()
    {
        AssertRoles(
            typeof(AppraisalFormController),
            Roles.SuperAdmin,
            Roles.Faculty,
            Roles.HOD,
            Roles.Principal,
            Roles.APEC);

        AssertMethodRoles(nameof(AppraisalFormController.Create), Roles.SuperAdmin, Roles.Faculty);
        AssertMethodRoles(nameof(AppraisalFormController.Update), Roles.SuperAdmin, Roles.Faculty);
        AssertMethodRoles(nameof(AppraisalFormController.Submit), Roles.SuperAdmin, Roles.Faculty);
        AssertMethodRoles(nameof(AppraisalFormController.HodReview), Roles.SuperAdmin, Roles.HOD);
        AssertMethodRoles(nameof(AppraisalFormController.PrincipalReview), Roles.SuperAdmin, Roles.Principal);
        AssertMethodRoles(nameof(AppraisalFormController.IqacReview), Roles.SuperAdmin, Roles.APEC);
        AssertMethodRoles(nameof(AppraisalFormController.Return), Roles.SuperAdmin, Roles.HOD, Roles.Principal, Roles.APEC);
        AssertMethodRoles(nameof(AppraisalFormController.Delete), Roles.SuperAdmin);
    }

    private static void AssertMethodRoles(string methodName, params string[] expectedRoles)
    {
        var method = typeof(AppraisalFormController).GetMethod(methodName);

        Assert.NotNull(method);
        AssertRoles(method, expectedRoles);
    }

    private static void AssertRoles(Type controllerType, params string[] expectedRoles)
    {
        var attribute = controllerType
            .GetCustomAttributes(typeof(AuthorizeAttribute), inherit: true)
            .Cast<AuthorizeAttribute>()
            .SingleOrDefault();

        Assert.NotNull(attribute);
        Assert.Equal(Normalize(expectedRoles), Normalize(attribute.Roles));
    }

    private static void AssertRoles(System.Reflection.MemberInfo memberInfo, params string[] expectedRoles)
    {
        var attribute = memberInfo
            .GetCustomAttributes(typeof(AuthorizeAttribute), inherit: true)
            .Cast<AuthorizeAttribute>()
            .SingleOrDefault();

        Assert.NotNull(attribute);
        Assert.Equal(Normalize(expectedRoles), Normalize(attribute.Roles));
    }

    private static string Normalize(string? roles)
    {
        Assert.False(string.IsNullOrWhiteSpace(roles));

        return Normalize(roles.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));
    }

    private static string Normalize(IEnumerable<string> roles)
    {
        return string.Join(",", roles.OrderBy(role => role));
    }
}
