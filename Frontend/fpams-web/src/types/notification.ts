export interface Notification {
    id: string;
    title: string;
    message: string;
    category: string;
    referenceId?: string | null;
    isRead: boolean;
    createdOn: string;
}
