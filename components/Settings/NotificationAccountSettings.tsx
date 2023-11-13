"use client";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import { details } from "@/types/details";
import { User } from "@/types/user";


export default function NotificationSettings (userdetails: any) {
  const { data: session } = useSession();

  return (
    <>
        <h1>Notification Settings</h1>
    </>
  );
}
