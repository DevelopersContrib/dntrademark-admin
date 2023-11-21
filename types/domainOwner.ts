import { items } from "@/types/items";
export type domainOwner = {
    id: number;
    item_id: number;
    keyword: string;
    owner_label: string;
    legal_entity_type:string;
    name:string;
    address1:string;
    city:string;
    state:string;
    country:string;
    postcode:string;
    created_at:string;
    updated_at:string;
    item: items;
  }