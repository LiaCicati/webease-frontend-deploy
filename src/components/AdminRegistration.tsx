"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import FormGrid from "@/components/custom/FormGrid";
import Logo from "@/components/custom/Logo";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { useToast } from "@/hooks/use-toast";
import { checkAdminExists, registerAdmin } from "@/services/AdminService";
import { User } from "@/models/User";
import { getErrors } from "@/utils/utils";
import { AxiosError } from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

const AdminRegistration = () => {
  const { values, errors, isValid, handleChange } = useFormWithValidation({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const register = async (adminData: User) => {
    try {
      await registerAdmin(adminData);
      localStorage.setItem("adminExists", "true");
      toast({
        title: "Success",
        description: "You have successfully created an admin account.",
        variant: "success",
      });
      router.push("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError; // Type cast the error to AxiosError
      const errorMessage = getErrors(axiosError);
      console.error("Error registering the admin:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setSubmitted(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (values.password !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    const adminStatus = await checkAdminExists();
    if (adminStatus) {
      toast({
        title: "Error",
        description: "An admin account already exists.",
        variant: "destructive",
      });
      return;
    }

    const adminData: User = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };
    setSubmitted(true);
    register(adminData);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-10">
      <form
        id="admin-registration"
        className="bg-white p-6 sm:p-8 md:p-10 rounded-md shadow-lg "
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="flex items-center justify-center pb-6 ">
          <Logo width={60} variant="noText" />
        </div>
        <h2 className="text-2xl text-center font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Welcome to WebEase
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600 text-center">
          Let&apos;s set up your initial admin account to get started.{" "}
        </p>

        <h2 className="text-base font-semibold leading-7 text-gray-900 mt-4">
          Personal Information
        </h2>

        <FormGrid>
          <div className="sm:col-span-3">
            <FormFieldGroup
              label="First name"
              name="firstName"
              id="firstName"
              type="text"
              required
              value={values.firstName}
              onChangeInput={handleChange}
              error={errors.firstName}
              minLength={2}
              maxLength={20}
              pattern="^[a-zA-Z\s]+$"
            />
          </div>

          <div className="sm:col-span-3">
            <FormFieldGroup
              label="Last name"
              name="lastName"
              id="lastName"
              type="text"
              required
              value={values.lastName}
              onChangeInput={handleChange}
              error={errors.lastName}
              minLength={2}
              maxLength={20}
              pattern="^[a-zA-Z\s]+$"
            />
          </div>

          <div className="col-span-full">
            <FormFieldGroup
              label="Email address"
              name="email"
              id="email"
              type="email"
              required
              value={values.email}
              onChangeInput={handleChange}
              error={errors.email}
            />
          </div>

          <div className="col-span-full">
            <FormFieldGroup
              label="Password"
              name="password"
              id="password"
              type="password"
              required
              minLength={8}
              maxLength={16}
              value={values.password}
              onChangeInput={handleChange}
              error={errors.password}
              pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,16}$"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger type="button">&#128274;</TooltipTrigger>
                <TooltipContent side="right">
                  <div className="mt-2 text-xs text-gray-600">
                    Password must meet the following criteria:
                    <ul className="list-disc pl-5 mt-2">
                      <li className="mt-1">At least one digit.</li>
                      <li className="mt-1">At least one lowercase letter.</li>
                      <li className="mt-1">At least one uppercase letter.</li>
                      <li className="mt-1">
                        At least one special character from the set @#$%^&-+=().
                      </li>
                      <li className="mt-1">No whitespace allowed.</li>
                      <li className="mt-1">
                        Total length of the password should be between 8 and 20
                        characters.
                      </li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="col-span-full">
            <FormFieldGroup
              label="Confirm Password"
              name="confirmPassword"
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              maxLength={16}
              value={values.confirmPassword}
              onChangeInput={handleChange}
              error={errors.confirmPassword}
            />
          </div>
        </FormGrid>
        <div className="border-gray-900/10 pt-12">
          <Button
            id="registerAdminButton"
            variant="default"
            size="lg"
            className="w-full"
            disabled={submitted || !isValid}
          >
            Let&apos;s start
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminRegistration;
