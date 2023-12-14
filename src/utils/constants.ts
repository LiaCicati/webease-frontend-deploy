import {
  LayoutIcon,
  TextIcon,
  WholeWordIcon,
  FileDigitIcon,
  CalendarIcon,
  SettingsIcon,
  FeatherIcon,
} from "lucide-react";

export const MAX_FREE_COUNTS = 5;

export const tools = [
  {
    label: "Content Manager",
    icon: FeatherIcon,
    href: "/content-manager",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Content-Type Builder",
    icon: LayoutIcon,
    href: "/content-type-builder",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    href: "/settings",
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
];

export const fields = [
  {
    label: "Text",
    icon: WholeWordIcon,
    href: "/content-type-builder",
    description: "Small or long text like title or description",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "RichText",
    icon: TextIcon,
    href: "/content-type-builder",
    description: "A rich text editor with formatting options",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Number",
    icon: FileDigitIcon,
    href: "/content-type-builder",
    description: "Numbers (integer, float, decimal)",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Date",
    icon: CalendarIcon,
    href: "/content-type-builder",
    description: "A date picker with hours, minutes and seconds",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
];
