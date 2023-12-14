import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/Card";
type CardProps = {
    onClick: () => void;
    href: string;
    icon: React.ElementType;
    label: string;
    description: string;
    id: string;
  };
  
const CustomCard: React.FC<CardProps> = ({id,  onClick, href, icon: Icon, label, description }) => {
    return (
      <Card
      id={id}
        onClick={onClick}
        key={href}
        className="card p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
      >
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Icon className="w-8 h-8" />
            <CardTitle>{label}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    );
  };
  

  export default CustomCard;