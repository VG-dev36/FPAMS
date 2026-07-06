export interface AcademicYear {
    id: string;
    yearName: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    isActive: boolean;
}

export interface CreateAcademicYearRequest {
    yearName: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
}

export interface UpdateAcademicYearRequest {
    id: string;
    yearName: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    isActive: boolean;
}
