export type InvoiceType = {
    additional_amount: string;
    created_at: string;
    desc: string;
    due_date: string;
    id: number
    package_amount: string;
    package_id: number
    status: string
    total: string
    updated_at: string
    user_id: number
}

export type InvoiceProps = {
    id: number;
    desc: string;
    package_amount: string;
    additional_amount: string;
    total: string;
    status: string;
    due_date: string
}