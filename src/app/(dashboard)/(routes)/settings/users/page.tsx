"use client";

import SettingsSideBar from "@/components/custom/SettingsSideBar";
import InviteUserDialog from "@/components/custom/InviteUserDialog";
import { UsersTable } from "@/components/UsersTable";
import { User } from "@/models/User";
import { getUsers } from "@/services/UserService";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await getUsers();
      const createdUsers = allUsers.filter(
        (user) => user.accountStatus === "CREATED"
      );

      setUsers(createdUsers);
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

  return (
    <div>
      <div className=" mt-4">
        <div className="flex-grow md:ml-72 mt-4 flex p-10 px-14">
          <div className="flex-grow">
            <h1 className="text-2xl leading-tight font-semibold text-black">
              Users
            </h1>
            <p className="text-base leading-normal text-gray-500">
              All the users who have access to WebEase
            </p>
          </div>

          <InviteUserDialog />
        </div>
      </div>
      <div className="flex-grow md:ml-72 mt-4">
        <div className="pl-56 pr-56">
          <div className="mt-6">
            <div className=" mx-auto ">
              {isLoading ? <p>Loading...</p> : <UsersTable users={users} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
