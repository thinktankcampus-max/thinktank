export interface RegistrationError {
    status: 'error' | 'fail';
    message: string;
    details?: {
        field: string;
        issue: string;
    }[];
    code?: string;
}

export interface PaymentVerificationResponse {
    status: 'success' | 'failure';
    transactionId?: string;
    message: string;
}
