"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Collection } from "@/models/Collection";
import { useToast } from "@/hooks/use-toast";
import ContentModelDialog from "./ContentModelDialog";
import { usePathname } from "next/navigation";
import CollectionsContext from "@/contexts/CollectionsContext";
import Link from "next/link";
interface ContentBuilderSideBarProps {
  title: string;
  showContentModelDialog?: boolean;
  basePath?: string;
}
function ContentBuilderSideBar({
  title,
  showContentModelDialog,
  basePath,
}: ContentBuilderSideBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedContentType, setSelectedContentType] =
    useState<Collection | null>(null);

  const { toast } = useToast();
  const { collections, fetchCollections } = useContext(CollectionsContext);

  const generateContentTypeUrl = (contentType: Collection) => {
    let basePath;
    if (pathname.includes("content-manager")) {
      basePath = "/content-manager/collections";
    } else if (pathname.includes("content-type-builder")) {
      basePath = "/content-type-builder/collections";
    }
    return `${basePath}/${contentType.name}`;
  };

  const isActive = (contentType: Collection) => {
    const url = generateContentTypeUrl(contentType);
    return pathname.startsWith(url);
  };
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);
  return (
    <div className="h-full md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 border-r border-gray-300">
      <div className="space-y-4 py-4 flex flex-col h-full text-white">
        <div className="px-3 py-2 flex-1">
          <h3 className="text-xxs  font-bold leading-1 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
            {title}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center flex-1 text-sm group flex p-3 w-full justify-start font-medium text-gray-400">
              Collection types
            </div>
            <ul className="list-disc pl-5 space-y-2">
              {collections.length > 0 ? (
                collections.map((contentType, index) => (
                  <li
                    key={index}
                    className={`text-sm font-medium ${
                      isActive(contentType)
                        ? "text-gray-500"
                        : "text-customBlue"
                    }`}
                  >
                    <Link
                      href={generateContentTypeUrl(contentType)}
                      className={`${
                        isActive(contentType)
                          ? "text-gray-500"
                          : "text-customBlue"
                      } hover:opacity-70 focus:outline-none`}
                    >
                      {contentType.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">
                  No collections available.
                </li>
              )}
            </ul>
          </div>

          {showContentModelDialog && <ContentModelDialog />}
        </div>
      </div>
    </div>
  );
}

export default ContentBuilderSideBar;
