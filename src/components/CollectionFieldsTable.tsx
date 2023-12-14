import { Attribute } from "@/models/Attribute";
import { Files, PlusIcon } from "lucide-react";
import { DataTable } from "./custom/DataTable";
import { Button } from "./ui/Button";
import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<Attribute>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "contentType",
    header: "Type",
  },
];
type CollectionFieldsTableProps = {
  attributes: Attribute[];
  onAddFieldClick: () => void;
};

export const CollectionFieldsTable: React.FC<CollectionFieldsTableProps> = ({
  attributes,
  onAddFieldClick,
}) => {
  return (
    <>
      <DataTable
      id="fieldsTable"
        columns={columns}
        data={attributes}
        emptyStateComponent={
          <div className="flex flex-col items-center space-y-4">
            <Files size={60} color="#0075ff" />
            <p>Add your first field to this Collection-Type</p>
            {attributes.length === 0 && (
              <Button
              id="addNewFieldButton"
                className="flex items-center space-x-2 mt-4"
                onClick={onAddFieldClick}
              >
                <PlusIcon />
                <span>Add new field</span>
              </Button>
            )}
          </div>
        }
      />
      {attributes.length > 0 && (
        <Button
        id="addNewFieldButton"
          className="flex items-center space-x-2 mt-4"
          onClick={onAddFieldClick}
        >
          <PlusIcon />
          <span>Add new field</span>
        </Button>
      )}
    </>
  );
};
