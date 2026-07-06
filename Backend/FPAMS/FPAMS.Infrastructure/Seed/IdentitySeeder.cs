using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Persistence.Context;
using FPAMS.Shared.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FPAMS.Infrastructure.Seed;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        if (!await context.Roles.AnyAsync())
        {
            foreach (var role in Roles.All)
            {
                context.Roles.Add(new Role
                {
                    Name = role,
                    Description = role
                });
            }

            await context.SaveChangesAsync();
        }

        await SeedMastersAsync(context);

        var adminRole = await context.Roles
            .FirstAsync(r => r.Name == Roles.SuperAdmin);

        var facultyRole = await context.Roles
            .FirstAsync(r => r.Name == Roles.Faculty);

        var hodRole = await context.Roles
            .FirstAsync(r => r.Name == Roles.HOD);

        var principalRole = await context.Roles
            .FirstAsync(r => r.Name == Roles.Principal);

        var apecRole = await context.Roles
            .FirstAsync(r => r.Name == Roles.APEC);

        if (!await context.Users.AnyAsync(x => x.Email == "admin@fpams.com"))
        {
            var admin = new User
            {
                EmployeeCode = "ADMIN001",

                FirstName = "System",

                LastName = "Administrator",

                Email = "admin@fpams.com",

                PasswordHash = passwordHasher.HashPassword("Admin@123"),

                Mobile = "9999999999",

                Designation = null,

                IsActive = true,

                DepartmentId = null,

                RoleId = adminRole.Id
            };

            context.Users.Add(admin);
        }

        if (!await context.Users.AnyAsync(x => x.Email == "faculty.cse@fpams.com"))
        {
            var cseDepartment = await context.Departments
                .FirstAsync(x => x.DepartmentCode == "CSE");

            var assistantProfessor = await context.Designations
                .FirstAsync(x => x.DesignationCode == "AP");

            var faculty = new User
            {
                EmployeeCode = "FAC001",
                FirstName = "Demo",
                LastName = "Faculty",
                Email = "faculty.cse@fpams.com",
                PasswordHash = passwordHasher.HashPassword("Faculty@123"),
                Mobile = "8888888888",
                IsActive = true,
                DepartmentId = cseDepartment.Id,
                DesignationId = assistantProfessor.Id,
                RoleId = facultyRole.Id
            };

            context.Users.Add(faculty);
            await context.SaveChangesAsync();

            context.FacultyProfiles.Add(new FacultyProfile
            {
                UserId = faculty.Id,
                DepartmentId = cseDepartment.Id,
                DesignationId = assistantProfessor.Id,
                DateOfJoining = new DateTime(2020, 6, 1),
                HighestQualification = "M.Tech",
                Specialization = "Computer Science and Engineering",
                TeachingExperienceYears = 5,
                IndustryExperienceYears = 1,
                IsActive = true
            });
        }

        await SeedWorkflowUsersAsync(
            context,
            passwordHasher,
            hodRole.Id,
            principalRole.Id,
            apecRole.Id);

        await context.SaveChangesAsync();

        await SeedDemoAppraisalAsync(context);
    }

    private static async Task SeedMastersAsync(AppDbContext context)
    {
        if (!await context.Departments.AnyAsync())
        {
            context.Departments.AddRange(
                new Department
                {
                    DepartmentCode = "CSE",
                    DepartmentName = "Computer Science and Engineering",
                    IsActive = true
                },
                new Department
                {
                    DepartmentCode = "ECE",
                    DepartmentName = "Electronics and Communication Engineering",
                    IsActive = true
                });
        }

        if (!await context.Designations.AnyAsync())
        {
            context.Designations.AddRange(
                new Designation
                {
                    DesignationCode = "AP",
                    DesignationName = "Assistant Professor",
                    Description = "Entry-level teaching faculty designation",
                    DisplayOrder = 1,
                    IsActive = true
                },
                new Designation
                {
                    DesignationCode = "ASP",
                    DesignationName = "Associate Professor",
                    Description = "Mid-level teaching faculty designation",
                    DisplayOrder = 2,
                    IsActive = true
                },
                new Designation
                {
                    DesignationCode = "PROF",
                    DesignationName = "Professor",
                    Description = "Senior teaching faculty designation",
                    DisplayOrder = 3,
                    IsActive = true
                });
        }

        if (!await context.AcademicYears.AnyAsync())
        {
            context.AcademicYears.Add(new AcademicYear
            {
                YearName = "2026-2027",
                StartDate = new DateTime(2026, 7, 1),
                EndDate = new DateTime(2027, 6, 30),
                IsCurrent = true,
                IsActive = true
            });
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedWorkflowUsersAsync(
        AppDbContext context,
        IPasswordHasher passwordHasher,
        Guid hodRoleId,
        Guid principalRoleId,
        Guid apecRoleId)
    {
        var cseDepartment = await context.Departments
            .FirstAsync(x => x.DepartmentCode == "CSE");

        var professor = await context.Designations
            .FirstAsync(x => x.DesignationCode == "PROF");

        if (!await context.Users.AnyAsync(x => x.Email == "hod.cse@fpams.com"))
        {
            context.Users.Add(new User
            {
                EmployeeCode = "HOD001",
                FirstName = "Demo",
                LastName = "HOD",
                Email = "hod.cse@fpams.com",
                PasswordHash = passwordHasher.HashPassword("Hod@123"),
                Mobile = "7777777777",
                IsActive = true,
                DepartmentId = cseDepartment.Id,
                DesignationId = professor.Id,
                RoleId = hodRoleId
            });
        }

        if (!await context.Users.AnyAsync(x => x.Email == "principal@fpams.com"))
        {
            context.Users.Add(new User
            {
                EmployeeCode = "PRI001",
                FirstName = "Demo",
                LastName = "Principal",
                Email = "principal@fpams.com",
                PasswordHash = passwordHasher.HashPassword("Principal@123"),
                Mobile = "6666666666",
                IsActive = true,
                DepartmentId = null,
                DesignationId = professor.Id,
                RoleId = principalRoleId
            });
        }

        if (!await context.Users.AnyAsync(x => x.Email == "apec@fpams.com"))
        {
            context.Users.Add(new User
            {
                EmployeeCode = "APEC001",
                FirstName = "Demo",
                LastName = "APEC",
                Email = "apec@fpams.com",
                PasswordHash = passwordHasher.HashPassword("Apec@123"),
                Mobile = "5555555555",
                IsActive = true,
                DepartmentId = null,
                DesignationId = professor.Id,
                RoleId = apecRoleId
            });
        }
    }

    private static async Task SeedDemoAppraisalAsync(AppDbContext context)
    {
        var facultyProfile = await context.FacultyProfiles
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.User.EmployeeCode == "FAC001");

        var currentYear = await context.AcademicYears
            .FirstOrDefaultAsync(x => x.IsCurrent);

        if (facultyProfile == null || currentYear == null)
            return;

        if (await context.AppraisalForms.AnyAsync(x =>
            x.FacultyProfileId == facultyProfile.Id
            && x.AcademicYearId == currentYear.Id
            && !x.IsDeleted))
            return;

        var appraisal = new AppraisalForm
        {
            FacultyProfileId = facultyProfile.Id,
            AcademicYearId = currentYear.Id,
            TeachingScore = 82,
            ResearchScore = 74,
            AdministrationScore = 68,
            ContributionScore = 88,
            EvidenceSummary = "Demo evidence summary for teaching, research, administration, and institutional contribution.",
            FacultyRemarks = "Demo appraisal prepared for first-run workflow verification.",
            Status = "Submitted",
            SubmittedOn = DateTime.UtcNow
        };

        context.AppraisalForms.Add(appraisal);

        context.Notifications.Add(new Notification
        {
            Title = "Demo Appraisal Submitted",
            Message = $"{facultyProfile.User.EmployeeCode} - {facultyProfile.User.FirstName} {facultyProfile.User.LastName} | {currentYear.YearName} | Status: Submitted",
            Category = "Appraisal",
            ReferenceId = appraisal.Id,
            IsRead = false
        });

        await context.SaveChangesAsync();
    }
}
