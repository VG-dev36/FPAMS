import WorkflowReviewPage from "./WorkflowReviewPage";

export default function PrincipalWorkflow() {
    return (
        <WorkflowReviewPage
            title="Principal Review"
            description="Review HOD-approved appraisals and forward eligible forms to IQAC/APEC."
            expectedStatus="HodReviewed"
            approveAction="principal"
            actionLabel="Principal Review"
        />
    );
}
