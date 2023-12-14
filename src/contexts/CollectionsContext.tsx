"use client";
import { Collection } from "@/models/Collection";
import { getCollections } from "@/services/CollectionService";
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkUserAuthenticated } from "@/services/UserService";
const CollectionsContext = createContext(null);

export const CollectionsProvider = ({ children }) => {
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);

  const fetchCollections = useCallback(async () => {
    const isAuthenticated = await checkUserAuthenticated();
    if (!isAuthenticated) {
      setCollections([]);
      return;
    }
    try {
      const allCollections = await getCollections();

      if (allCollections.length === 0) {
        setCollections([]);

        return;
      }

      setCollections(allCollections);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching collections:", error.message);

        if (error.message !== "No collections found") {
          toast({
            title: "Error",
            description: "Failed to fetch collections.",
            variant: "destructive",
          });
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  }, [getCollections, toast]);

  const updateCollection = useCallback((collectionId, newField) => {
    setCollections((prevCollections) => {
      return prevCollections.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            attributes: [...collection.attributes, newField],
          };
        }
        return collection;
      });
    });
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <CollectionsContext.Provider
      value={{ collections, updateCollection, fetchCollections }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export default CollectionsContext;
