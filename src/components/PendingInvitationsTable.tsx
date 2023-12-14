import { DataTable } from "./custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/models/User";
export const columns: ColumnDef<User & { isTokenExpired?: boolean }>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isTokenExpired",
    header: "Invitation Status",
    cell: (context) => {
      console.log("Cell value:", context.getValue());
      return context.getValue() ? "Expired" : "Valid";
    },
  },
];

type PendingInvitationsTableProps = {
  users: User[];
  buttonLabel: string;
  onButtonClick: (user: User) => () => void;
};

export const PendingInvitationsTable: React.FC<
  PendingInvitationsTableProps
> = ({ users, buttonLabel, onButtonClick }) => {
  return (
    <>
      <DataTable
        id="usersTable"
        columns={columns}
        data={users}
        renderButton={(rowData) =>
          rowData.isTokenExpired ? buttonLabel : null
        }
        defaultButtonLabel={buttonLabel}
        onButtonClick={(rowData) => onButtonClick(rowData)}
      />
    </>
  );
};
