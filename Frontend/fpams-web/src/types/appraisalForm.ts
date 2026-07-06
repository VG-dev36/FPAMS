export type AppraisalStatus =
    | "Draft"
    | "Submitted"
    | "HodReviewed"
    | "PrincipalReviewed"
    | "IqacReviewed"
    | "Returned";

export interface AppraisalForm {
    id: string;
    facultyProfileId: string;
    facultyName: string;
    employeeCode: string;
    departmentName: string;
    academicYearId: string;
    academicYearName: string;
    teachingScore: number;
    researchScore: number;
    administrationScore: number;
    contributionScore: number;
    totalScore: number;
    evidenceSummary: string;
    facultyRemarks: string;
    reviewerRemarks: string;
    status: AppraisalStatus;
    submittedOn?: string | null;
}

export interface CreateAppraisalFormRequest {
    facultyProfileId: string;
    academicYearId: string;
    teachingScore: number;
    researchScore: number;
    administrationScore: number;
    contributionScore: number;
    evidenceSummary: string;
    facultyRemarks: string;
}

export interface UpdateAppraisalFormRequest extends CreateAppraisalFormRequest {
    id: string;
}
