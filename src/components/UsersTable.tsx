import { DataTable } from "./custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/models/User";
import { useRouter } from "next/navigation";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "userType",
    header: "Role",
  },
];

type UsersTableProps = {
  users: User[];
};

export const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const router = useRouter();
  const handleRowClick = (user: User) => {
    router.push(`/settings/users/${user.userId}`);
  };

  return (
    <>
      <DataTable
        id="usersTable"
        columns={columns}
        data={users}
        onRowClick={handleRowClick}
      />
    </>
  );
};
