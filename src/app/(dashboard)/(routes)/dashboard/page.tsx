"use client";

import { ArrowRight, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/utils";

import { tools } from "@/utils/constants";
import Cookies from "js-cookie";
import { parseJwt } from "@/utils/auth";
import { useEffect, useState } from "react";
interface Tool {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
  bgColor: string;
}

export default function HomePage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("DEFAULT");
  const [accessibleTools, setAccessibleTools] = useState<Tool[]>([]);

  useEffect(() => {
    const token = Cookies.get("token");
    const payload = token ? parseJwt(token) : null;
    const role = payload ? payload._userRole : "DEFAULT";
    setUserRole(role);

    const newAccessibleTools = tools.filter((tool) => {
      if (role === "ADMIN") {
        return true; // Admin has access to all tools
      } else if (role === "EDITOR") {
        return !["/content-type-builder", "/settings"].includes(tool.href);
      } else if (role === "DEFAULT") {
        return ["/dashboard"].includes(tool.href);
      }
      return false;
    });

    setAccessibleTools(newAccessibleTools);
  }, []);

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Welcome 👋
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          We hope you are making progress on your project!
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {accessibleTools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
}
