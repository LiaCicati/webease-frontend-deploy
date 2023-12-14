"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import FormGrid from "@/components/custom/FormGrid";
import Logo from "@/components/custom/Logo";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/models/User";
import { validateToken } from "@/services/EmailInvitationService";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { setPassword } from "@/services/UserService";
import TokenInvalidMessage from "@/components/TokenInvalidMessage";
const Register = () => {
  const { values, errors, isValid, handleChange } = useFormWithValidation({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [submitted, setSubmitted] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [userData, setUserData] = useState<User>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await validateToken(token!);
        if (data && data.email && data.firstName && data.lastName) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setTokenValid(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
      setTokenValid(false);
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const register = async (password: string) => {
    if (!userData || !userData.userId) {
      toast({
        title: "Error",
        description: "User data is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      await setPassword(userData.userId, password);
      toast({
        title: "Success",
        description: "Password set successfully",
        variant: "success",
      });
      // Redirect to login page after successful registration
      router.push("/sign-in");
    } catch (error) {
      console.error("Failed to set password:", error);

      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Validation error. Please check your input.";
            break;
          case 409:
            errorMessage = "Password is already set for this user.";
            break;
          default:
            break;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      toast({
        title: "Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    if (values.password !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    await register(values.password);
  };
  if (!tokenValid) {
    return <TokenInvalidMessage />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-10">
      <form
        id="login-form"
        className="bg-white p-6 sm:p-8 md:p-10 rounded-md shadow-lg"
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
          Provide a secure password to get started.
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
              defaultValue={userData?.firstName}
              minLength={2}
              maxLength={20}
              pattern="^[a-zA-Z\s]+$"
              readonly={true}
            />
          </div>

          <div className="sm:col-span-3">
            <FormFieldGroup
              label="Last name"
              name="lastName"
              id="lastName"
              type="text"
              required
              defaultValue={userData?.lastName}
              minLength={2}
              maxLength={20}
              pattern="^[a-zA-Z\s]+$"
              readonly={true}
            />
          </div>

          <div className="col-span-full">
            <FormFieldGroup
              label="Email address"
              name="email"
              id="email"
              type="email"
              required
              defaultValue={userData?.email}
              readonly={true}
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
            id="registerButton"
            variant="default"
            size="lg"
            className="w-full"
            disabled={submitted || !isValid}
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
