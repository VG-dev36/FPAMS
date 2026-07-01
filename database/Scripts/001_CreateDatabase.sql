/*==========================================================
    PROJECT : FPAMS
    VERSION : 1.0
    DATABASE: SQL SERVER 2022
==========================================================*/

IF DB_ID('FPAMS_DB') IS NULL
BEGIN
    CREATE DATABASE FPAMS_DB;
END
GO

USE FPAMS_DB;
GO

/*==========================================================
    ROLES
==========================================================*/

CREATE TABLE Roles
(
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedOn DATETIME NOT NULL DEFAULT GETDATE()
);
GO

INSERT INTO Roles(RoleName,Description)
VALUES
('SUPER_ADMIN','System Administrator'),
('PRINCIPAL','Principal'),
('APEC','APEC Committee'),
('HOD','Head Of Department'),
('FACULTY','Faculty');
GO

/*==========================================================
    DEPARTMENTS
==========================================================*/

CREATE TABLE Departments
(
    DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentCode NVARCHAR(20) NOT NULL UNIQUE,
    DepartmentName NVARCHAR(200) NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedOn DATETIME DEFAULT GETDATE()
);
GO

/*==========================================================
    USERS
==========================================================*/

CREATE TABLE Users
(
    UserId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    EmployeeCode NVARCHAR(20) NOT NULL UNIQUE,

    FirstName NVARCHAR(100) NOT NULL,

    LastName NVARCHAR(100),

    Gender NVARCHAR(20),

    DOB DATE,

    Email NVARCHAR(150) NOT NULL UNIQUE,

    Mobile NVARCHAR(15),

    PasswordHash NVARCHAR(MAX) NOT NULL,

    RoleId INT NOT NULL,

    DepartmentId INT NULL,

    Designation NVARCHAR(100),

    IsActive BIT NOT NULL DEFAULT 1,

    LastLogin DATETIME NULL,

    CreatedOn DATETIME DEFAULT GETDATE(),

    UpdatedOn DATETIME NULL,

    CONSTRAINT FK_User_Role
        FOREIGN KEY(RoleId)
        REFERENCES Roles(RoleId),

    CONSTRAINT FK_User_Department
        FOREIGN KEY(DepartmentId)
        REFERENCES Departments(DepartmentId)
);
GO

/*==========================================================
    ACADEMIC YEARS
==========================================================*/

CREATE TABLE AcademicYears
(
    AcademicYearId INT IDENTITY PRIMARY KEY,

    AcademicYear NVARCHAR(20) NOT NULL,

    StartDate DATE NOT NULL,

    EndDate DATE NOT NULL,

    IsCurrent BIT DEFAULT 0,

    IsLocked BIT DEFAULT 0,

    CreatedOn DATETIME DEFAULT GETDATE()
);
GO

/*==========================================================
    HOD MAPPING
==========================================================*/

CREATE TABLE DepartmentHOD
(
    Id INT IDENTITY PRIMARY KEY,

    DepartmentId INT NOT NULL,

    UserId UNIQUEIDENTIFIER NOT NULL,

    FromDate DATE,

    ToDate DATE,

    IsCurrent BIT DEFAULT 1,

    FOREIGN KEY(DepartmentId)
    REFERENCES Departments(DepartmentId),

    FOREIGN KEY(UserId)
    REFERENCES Users(UserId)
);
GO

/*==========================================================
    FACULTY PROFILE
==========================================================*/

CREATE TABLE FacultyProfiles
(
    FacultyId INT IDENTITY PRIMARY KEY,

    UserId UNIQUEIDENTIFIER NOT NULL UNIQUE,

    Qualification NVARCHAR(300),

    Experience DECIMAL(6,2),

    DOJ DATE,

    PAN NVARCHAR(20),

    Aadhaar NVARCHAR(20),

    Address NVARCHAR(MAX),

    Photo NVARCHAR(500),

    FOREIGN KEY(UserId)
    REFERENCES Users(UserId)
);
GO

/*==========================================================
    APPRAISAL STATUS
==========================================================*/

CREATE TABLE WorkflowStatus
(
    WorkflowStatusId INT PRIMARY KEY,

    StatusName NVARCHAR(100)
);
GO

INSERT INTO WorkflowStatus
VALUES
(1,'Draft'),
(2,'Submitted'),
(3,'Returned By HOD'),
(4,'Verified By HOD'),
(5,'Returned By Principal'),
(6,'Approved By Principal'),
(7,'Returned By APEC'),
(8,'Completed');
GO

/*==========================================================
    APPRAISAL HEADER
==========================================================*/

CREATE TABLE AppraisalForms
(
    AppraisalId BIGINT IDENTITY PRIMARY KEY,

    FacultyId INT NOT NULL,

    AcademicYearId INT NOT NULL,

    WorkflowStatusId INT NOT NULL,

    ClaimedScore DECIMAL(8,2) DEFAULT 0,

    VerifiedScore DECIMAL(8,2) DEFAULT 0,

    FinalScore DECIMAL(8,2) DEFAULT 0,

    SubmittedOn DATETIME NULL,

    Locked BIT DEFAULT 0,

    CreatedOn DATETIME DEFAULT GETDATE(),

    FOREIGN KEY(FacultyId)
    REFERENCES FacultyProfiles(FacultyId),

    FOREIGN KEY(AcademicYearId)
    REFERENCES AcademicYears(AcademicYearId),

    FOREIGN KEY(WorkflowStatusId)
    REFERENCES WorkflowStatus(WorkflowStatusId)
);
GO