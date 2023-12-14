"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import "react-quill/dist/quill.snow.css";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { User } from "@/models/User";
import { useRouter } from "next/navigation";
import { getUserById } from "@/services/UserService";
import FormGrid from "@/components/custom/FormGrid";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import { Label } from "@/components/ui/Label";
import { updateUser, deleteUser } from "@/services/UserService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { getErrors } from "@/utils/utils";
import DeleteUserDialog from "@/components/custom/DeleteUserDialog";
interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

const UserDetailsPage = ({ params }: Params) => {
  const router = useRouter();
  const { toast } = useToast();
  const { values, errors, isValid, handleChange, setValues, setIsValid } =
    useFormWithValidation<UserFormValues>({
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
    });

  const [error, setError] = useState("");
  const { userId } = params;
  const [user, setUser] = useState<User>();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    router.back();
  };

  useEffect(() => {
    setLoading(true);
    getUserById(userId)
      .then((data) => {
        setUser(data);
        setValues({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          userType: data.userType || "",
        });
        setIsValid(true);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [userId, setValues]);

  const handleUserTypeChange = (userType: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      userType: userType,
    }));
  };

  const updateUserDetails = async (userData: UserFormValues) => {
    try {
      await updateUser(userId, userData);
      toast({
        title: "Success",
        description: "User details updated successfully.",
        variant: "success",
      });
      setSubmitted(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = getErrors(axiosError);
      console.error("Error updating user:", errorMessage);
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
    setSubmitted(true);
    updateUserDetails(values);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
        variant: "success",
      });
      router.push("/settings/users");
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = getErrors(axiosError);
      console.error("Error deleting user:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="md:flex">
      <div className="flex-grow md:ml-72 mt-4">
        <div className="flex flex-col md:flex-row p-8">
          {/* Form Section */}
          <div className="flex-grow">
            <div className="mb-4">
              <Button
                variant="link"
                onClick={handleBackClick}
                className="text-blue-600 hover:text-blue-700 focus:outline-none transition duration-150 ease-in-out"
              >
                ← Back
              </Button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {user &&
                        `${user.firstName} ${user.lastName}'s Information`}
                    </h1>
                    <p className="text-sm text-gray-600">User Details:</p>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  id="entry-form"
                  className="bg-white p-6 sm:p-8 md:p-10 rounded-md shadow-lg"
                  noValidate
                >
                  <div className="flex items-center space-x-2">
                    <Button
                      disabled={submitted || !isValid}
                      className="ml-auto"
                    >
                      Update
                    </Button>
                  </div>

                  {user && (
                    <>
                      <FormGrid>
                        <div className="sm:col-span-3">
                          <FormFieldGroup
                            label="First name"
                            name="firstName"
                            id="firstName"
                            type="text"
                            required
                            value={values.firstName || ""}
                            onChangeInput={handleChange}
                            error={errors.firstName}
                            minLength={2}
                            maxLength={20}
                            pattern="^[a-zA-Z\s]+$"
                          />
                        </div>
                      </FormGrid>
                      <FormGrid>
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
                      </FormGrid>
                      <FormGrid>
                        <div className="sm:col-span-3">
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
                      </FormGrid>
                      <FormGrid>
                        <div>
                          <Label className="flex mb-4">Role</Label>
                          <Select
                            required
                            value={values.userType}
                            onValueChange={handleUserTypeChange}
                          >
                            <SelectTrigger className="w-[380px]">
                              <SelectValue placeholder="Choose here" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem id="admin" value="ADMIN">
                                Admin
                              </SelectItem>
                              <SelectItem id="editor" value="EDITOR">
                                Editor
                              </SelectItem>
                              <SelectItem id="default" value="DEFAULT">
                                Default
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </FormGrid>
                    </>
                  )}
                </form>

                <div className="mt-4">
                  <DeleteUserDialog
                    userId={userId}
                    onDelete={(userId) => {
                      handleDeleteUser(userId);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
