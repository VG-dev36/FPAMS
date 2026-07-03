export interface Department {
    id: string;
    departmentCode: string;
    departmentName: string;
    isActive: boolean;
}

export interface CreateDepartmentRequest {
    departmentCode: string;
    departmentName: string;
    isActive: boolean;
}

export interface UpdateDepartmentRequest {
    id: string;
    departmentCode: string;
    departmentName: string;
    isActive: boolean;
}