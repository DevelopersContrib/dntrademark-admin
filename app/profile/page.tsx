import React, { useState } from 'react'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Tabmenu from '@/components/Settings/Tabmenu';

import { getUser } from '@/lib/data';


/*
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Account Settings | dntrademark.com",
  // other metadata
};*/

export default async function Profile() {
  
  
  const userdetails = await getUser();

  return (
    <>
      <Breadcrumb pageName="Account Settings" />
      <Tabmenu  userdetails={userdetails} />

    </>
  );
}

