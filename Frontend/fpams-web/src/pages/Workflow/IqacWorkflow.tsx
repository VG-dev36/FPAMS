import WorkflowReviewPage from "./WorkflowReviewPage";

export default function IqacWorkflow() {
    return (
        <WorkflowReviewPage
            title="IQAC/APEC Review"
            description="Finalize Principal-reviewed appraisals for institutional records and reporting."
            expectedStatus="PrincipalReviewed"
            approveAction="iqac"
            actionLabel="IQAC/APEC Review"
        />
    );
}
