"use client";

import React, { useState, useContext } from "react";
import { Collection } from "@/models/Collection";
import CollectionsContext from "@/contexts/CollectionsContext";
import ContentModelDialog from "@/components/custom/ContentModelDialog";
export default function CollectionsPage() {
  const [selectedContentType, setSelectedContentType] =
    useState<Collection | null>(null);

  const { collections } = useContext(CollectionsContext);

  return (
    <div className="md:flex">
      <div className="flex-grow md:ml-72 mt-4">
        {!selectedContentType && collections.length == 0 && (
          <div className=" mt-4">
            <div className="flex justify-center items-center h-full p-8">
              <div className="flex justify-between items-center w-full">
                <div className="pr-8 w-1/2">
                  <h1 className="text-xxs  font-bold leading-1 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
                    First, design the content model
                  </h1>
                  <p className="mb-6 mt-6">
                    The content model is a collection of all different types of
                    content for a project. It is a schema that editors
                    repeatably use and fill with content.
                  </p>
                  <ContentModelDialog />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
