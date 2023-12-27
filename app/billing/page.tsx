import Billing from "@/components/Billing/Billing";
import React from "react";
import { getInvoice } from "@/lib/data";

export default async function Page() {
  const invoiceData = await getInvoice();

  const searchInvoice = () => {
    console.log("searchInvoice");
  }

  return (
    <>
      <Billing invoiceData={invoiceData} />
    </>
  );
}
