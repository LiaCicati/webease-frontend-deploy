"use client";
type Params = {
  params: {
    contentType: string;
  };
};
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { PostsTable } from "@/components/PostsTable";
import CollectionsContext from "@/contexts/CollectionsContext";
export default function ContentTypePage({ params }: Params) {
  const { contentType } = params;

  const router = useRouter();
  const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation({});
  const { collections } = useContext(CollectionsContext);

  const selectedContentType = collections.find(
    (item) => item.name === contentType
  );

  if (!selectedContentType) {
    console.log("no data");
  }

  const redirectToCreatePage = (contentType) => {
    router.push(`/content-manager/collections/${contentType}/create`);
  };

  return (
    <>
      {selectedContentType && (
        <div className="flex-grow md:ml-72 mt-4">
          <h2>{selectedContentType.name}</h2>
          <p>{selectedContentType.description}</p>
          <div className="pl-56 pr-56">
            <div className="mt-6">
              <div className="container mx-auto py-10">
                <PostsTable
                  collectionName={selectedContentType.name}
                  collectionId={selectedContentType.id}
                  attributes={selectedContentType.attributes}
                  onAddFieldClick={() =>
                    redirectToCreatePage(params.contentType)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
