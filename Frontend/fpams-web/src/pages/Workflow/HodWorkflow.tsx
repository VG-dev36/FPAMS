import WorkflowReviewPage from "./WorkflowReviewPage";

export default function HodWorkflow() {
    return (
        <WorkflowReviewPage
            title="HOD Review"
            description="Review submitted faculty appraisals and forward approved forms to the Principal."
            expectedStatus="Submitted"
            approveAction="hod"
            actionLabel="HOD Review"
        />
    );
}
