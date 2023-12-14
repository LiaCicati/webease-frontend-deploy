"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import FormGrid from "@/components/custom/FormGrid";
import Logo from "@/components/custom/Logo";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/models/User";
import { loginUser } from "@/services/UserService";
import { AxiosError } from "axios";
import { getErrors } from "@/utils/utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const Login = () => {
  const { values, errors, isValid, handleChange } = useFormWithValidation({
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const login = async (userData: User) => {
    try {
      const response = await loginUser(userData);
      const token = response;
      if (token) {
        Cookies.set("token", token); 
        localStorage.setItem("token", token);
        console.log('the token')
      }
      console.log(token);
      toast({
        title: "Success",
        description: "You have successfully signed in.",
        variant: "success",
      });

      router.push("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = getErrors(axiosError);
      console.error("Error logging in:", errorMessage);
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

    const userData: User = {
      email: values.email,
      password: values.password,
      firstName: "",
      lastName: "",
    };
    setSubmitted(true);
    login(userData);
  };

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
          Welcome back to WebEase
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600 text-center">
          Sign in to your account to get started.
        </p>

        <FormGrid>
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
          </div>
        </FormGrid>
        <div className="border-gray-900/10 pt-12">
          <Button
            id="loginButton"
            variant="default"
            size="lg"
            className="w-full"
            disabled={submitted || !isValid}
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
