import { PackagesProps } from "@/types/packages";
import { InvoiceProps } from "@/types/invoice";

export type StripePackage = {
    id: string;
    pack:PackagesProps
};

export type StripeInvoice = {
    id: string;
    pack:InvoiceProps
};