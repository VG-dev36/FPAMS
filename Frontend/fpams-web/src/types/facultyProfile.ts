export interface FacultyProfile {
    id: string;
    userId: string;
    employeeCode: string;
    facultyName: string;
    email: string;
    departmentId: string;
    departmentName: string;
    designationId: string;
    designationName: string;
    dateOfJoining: string;
    highestQualification: string;
    specialization: string;
    teachingExperienceYears: number;
    industryExperienceYears: number;
    isActive: boolean;
}

export interface CreateFacultyProfileRequest {
    userId: string;
    departmentId: string;
    designationId: string;
    dateOfJoining: string;
    highestQualification: string;
    specialization: string;
    teachingExperienceYears: number;
    industryExperienceYears: number;
}

export interface UpdateFacultyProfileRequest extends CreateFacultyProfileRequest {
    id: string;
    isActive: boolean;
}
