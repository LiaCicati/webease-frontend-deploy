import { LucideIcon } from "lucide-react";
import CustomCard from "./custom/CustomCard";
type Field = {
  id?: string;
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
};

type GridViewProps = {
  fields: Field[];
  onCardClick: (field: Field) => void;
};
function GridView({ fields, onCardClick }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {fields.map((field, index) => (
        <CustomCard
          id={field.label}
          key={field.id || index}
          onClick={() => onCardClick(field)}
          href={field.href}
          icon={field.icon}
          label={field.label}
          description={field.description}
        />
      ))}
    </div>
  );
}

export default GridView;
