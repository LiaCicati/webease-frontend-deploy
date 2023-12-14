"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { checkAdminExists } from "@/services/AdminService";
import AdminRegistration from "@/components/AdminRegistration";
import { checkUserAuthenticated } from "@/services/UserService";

const LandingPage = () => {
  const router = useRouter();
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchData() {
      const isAuthenticated = await checkUserAuthenticated(); // Check if user is authenticated
      if (isAuthenticated) {
        router.push("/dashboard"); // Redirect to dashboard if authenticated
        return;
      }

      const adminExistsInLocalStorage = localStorage.getItem("adminExists");
      if (adminExistsInLocalStorage !== null) {
        setAdminExists(adminExistsInLocalStorage === "true");
        return;
      }

      const result = await checkAdminExists();
      localStorage.setItem("adminExists", result.toString());
      setAdminExists(result);
    }

    fetchData();
  }, [router]);

  useEffect(() => {
    if (adminExists) {
      router.push("/sign-in");
    }
  }, [adminExists, router]);

  if (adminExists === null) {
    return null;
  }

  if (adminExists) {
    return null;
  } else {
    return <AdminRegistration />;
  }
};

export default LandingPage;
