import ContentBuilderSideBar from "@/components/custom/ContentBuilderSideBar";

const CollectionsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div >
       <ContentBuilderSideBar
        title="Content"
        basePath="/content-manager/collections"
      />
      {children}
    </div>
  );
};

export default CollectionsLayout;
