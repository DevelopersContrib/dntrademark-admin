import { domains } from "@/types/domains";
import { domainOwner } from "@/types/domainOwner";
export type items = {
    id: number;
    created_at: string;
    updated_at: string;
    domain_id: number;
    keyword:string;
    registration_number:string;
    serial_number:string;
    status_label:string;
    status_date:string;
    status_definition:string;
    filing_date:string;
    registration_date:string;
    abandonment_date:string;
    expiration_date:string;
    description:string;
    domain:domains;
    owner:domainOwner;
  }