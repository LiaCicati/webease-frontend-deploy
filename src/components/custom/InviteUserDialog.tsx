
"use client";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import FormFieldGroup from "./FormFieldGroup";
import FormGrid from "./FormGrid";
import { useRef, useState } from "react";
import { inviteUser } from "@/services/EmailInvitationService";

import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { User } from "@/models/User";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { getErrors } from "@/utils/utils";
import { Label } from "../ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
function InviteUserDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const closeDialogButtonRef = useRef<HTMLButtonElement | null>(null);
  const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation({
      firstName: "",
      lastName: "",
      email: "",
      userType: "DEFAULT",
    });
  const { toast } = useToast();

  const handleUserTypeChange = (userType: string) => {
    // Update the form state with the new userType
    setValues((prevValues) => ({
      ...prevValues,
      userType: userType,
    }));
  };
  const sendInvitation = async (userData: User) => {
    try {
      await inviteUser(userData);

      toast({
        title: "Success",
        description: "You have successfully sent an invitation.",
        variant: "success",
      });
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = getErrors(axiosError);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const userData: User = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      userType: values.userType,
    };

    sendInvitation(userData).finally(() => {
      setSubmitted(false);
    });
  };
  const resetForm = () => {
    setValues({
      firstName: "",
      lastName: "",
      email: "",
      userType: "DEFAULT",
    });
    setSubmitted(false);
  };
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm();
        }
        setIsDialogOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button id="inviteNewUserButton">&#9993; Invite new user</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle> Invite new user</DialogTitle>
          <DialogDescription>User details</DialogDescription>
        </DialogHeader>
        <form id="invite-user-form" onSubmit={handleSubmit} noValidate>
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
            <div>
              <Label className="flex mb-4">Role</Label>
              <Select
                required
                value={values.userType}
                onValueChange={handleUserTypeChange}
              >
                <SelectTrigger className="w-[280px]">
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
          <DialogFooter style={{ paddingTop: "48px" }}>
            <DialogClose ref={closeDialogButtonRef}>
              <Button variant="outline" type="button" id="cancelButton">
                Cancel
              </Button>
            </DialogClose>
            <Button
              id="inviteUserButton"
              type="submit"
              disabled={submitted || !isValid}
            >
              Invite user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteUserDialog;
