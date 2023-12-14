"use client";

import SettingsSideBar from "@/components/custom/SettingsSideBar";
import { User } from "@/models/User";
import { getUsers } from "@/services/UserService";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PendingInvitationsTable } from "@/components/PendingInvitationsTable";
import {
  isTokenExpired,
  resendInvitation,
} from "@/services/EmailInvitationService";
export default function PendingInvitationsPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await getUsers();
      const pendingUsers = allUsers.filter(
        (user) => user.accountStatus === "PENDING"
      );

      // Fetch expiration status for each user concurrently
      const expirationStatuses = await Promise.all(
        pendingUsers.map((user) => isTokenExpired(user.userId!))
      );

      // Update each user object with the fetched status
      pendingUsers.forEach((user, index) => {
        user.isTokenExpired = expirationStatuses[index];
        console.log(user.isTokenExpired);
      });

      setUsers(pendingUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const handleButtonClick = (user: User) => async () => {
    try {
      const response = await resendInvitation(user.userId!);
      const message = response;

      if (message === "Invitation resent successfully!") {
        toast({
          title: "Success",
          description: `Invitation resent to ${user.email}.`,
          variant: "success",
        });
      } else if (message === "Invitation is still valid.") {
        toast({
          title: "Note",
          description: "Invitation is still valid.",
          variant: "default",
        });
      } else {
        // Handles other potential responses or unexpected messages
        toast({
          title: "Information",
          description: message,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to resend invitation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className=" mt-4">
        <div className="flex-grow md:ml-72 mt-4 flex p-10 px-14">
          <div className="flex-grow">
            <h1 className="text-2xl leading-tight font-semibold text-black">
              Pending Users
            </h1>
            <p className="text-base leading-normal text-gray-500">
              All the users that received an invitation to set up a WebEase
              account
            </p>
          </div>
        </div>
      </div>
      <div className="flex-grow md:ml-72 mt-4">
        <div className="pl-56 pr-56">
          <div className="mt-6">
            <div className=" mx-auto ">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <PendingInvitationsTable
                  users={users}
                  buttonLabel="Resend Invitation"
                  onButtonClick={handleButtonClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
