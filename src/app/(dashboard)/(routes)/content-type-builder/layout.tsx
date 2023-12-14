import ContentBuilderSideBar from "@/components/custom/ContentBuilderSideBar";

const CollectionsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="md:flex">
      <ContentBuilderSideBar
        title="Content-Type Builder"
        showContentModelDialog={true}
      />
      {children}
    </div>
  );
};

export default CollectionsLayout;
