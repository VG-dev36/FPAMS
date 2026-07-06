export interface Designation {
    id: string;
    designationCode: string;
    designationName: string;
    description?: string | null;
    displayOrder: number;
    isActive: boolean;
}

export interface CreateDesignationRequest {
    designationCode: string;
    designationName: string;
    description?: string | null;
    displayOrder: number;
}

export interface UpdateDesignationRequest {
    id: string;
    designationCode: string;
    designationName: string;
    description?: string | null;
    displayOrder: number;
    isActive: boolean;
}
