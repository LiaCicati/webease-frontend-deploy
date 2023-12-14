"use client";
import { Post } from "@/models/Post";
import { Files, PlusIcon } from "lucide-react";
import { DataTable } from "./custom/DataTable";
import { Button } from "./ui/Button";
import { ColumnDef } from "@tanstack/react-table";
import { getPostsByCollectionId } from "@/services/PostService";
import { useEffect, useState } from "react";
import { Attribute } from "@/models/Attribute";
import { useRouter } from "next/navigation";
export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "attributes.title",
    header: "Name",
  },
  {
    accessorKey: "_id.date",
    header: "Created at",
  },
];
type PostsTableProps = {
  collectionId: string;
  collectionName: string;
  onAddFieldClick: () => void;
  attributes: Attribute[];
};

export const PostsTable: React.FC<PostsTableProps> = ({
  collectionId,
  onAddFieldClick,
  attributes,
  collectionName,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  // Function to format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long" as const, 
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
      hour: "numeric" as const,
      minute: "numeric" as const,
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };
  

  // Find the first TEXT and required attribute from attributes prop
  const firstTextRequiredAttribute = attributes.find(
    (attr) => attr.contentType === "TEXT" && attr.required
  );

  // Defining columns for the first required TEXT type attribute, and the created date
  let dynamicColumns = [];

  if (firstTextRequiredAttribute) {
    dynamicColumns.push({
      accessorKey: `attributes.${firstTextRequiredAttribute.name}`,
      header:
        firstTextRequiredAttribute.name ||
        firstTextRequiredAttribute.name.charAt(0).toUpperCase() +
          firstTextRequiredAttribute.name.slice(1),
    });
  }

  // Adds a column for the formatted creation date
  dynamicColumns.push({
    id: "created_at",
    header: "Created at",
    cell: ({ row }) => formatDate(row.original._id.date),
  });

  // View specific post details
  const handleRowClick = (post: Post) => {
    router.push(
      `/content-manager/collections/${collectionName}/${post.postId}`
    );
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  console.log(collectionId);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPosts = await getPostsByCollectionId(collectionId);
        setPosts(fetchedPosts);
      } catch (error) {
        setError("Failed to fetch posts");
        console.log("error failed");
      } finally {
        setLoading(false);
      }
    };
    if (collectionId) {
      fetchPosts();
    }
  }, [collectionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <DataTable
        defaultButtonLabel="Create new entry"
        id="fieldsTable"
        columns={dynamicColumns}
        data={posts}
        onRowClick={handleRowClick}
        emptyStateComponent={
          <div className="flex flex-col items-center space-y-4">
            <Files size={60} color="#0075ff" />
            <p>No content found</p>
            {posts.length === 0 && (
              <Button
                id="addEntryButton"
                className="flex items-center space-x-2 mt-4"
                onClick={onAddFieldClick}
              >
                <PlusIcon />
                <span>Create new entry</span>
              </Button>
            )}
          </div>
        }
      />
      {posts.length > 0 && (
        <Button
          id="addNewEntryButton"
          className="flex items-center space-x-2 mt-4"
          onClick={onAddFieldClick}
        >
          <PlusIcon />
          <span>Add new entry</span>
        </Button>
      )}
    </>
  );
};
