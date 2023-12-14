import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import FormFieldGroup from "./FormFieldGroup";
import FormGrid from "./FormGrid";
import { useContext, useEffect, useRef, useState } from "react";
import { Collection } from "@/models/Collection";
import { addCollection, getCollections } from "@/services/CollectionService";
import { useToast } from "@/hooks/use-toast";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { AxiosError } from "axios";
import { getErrors } from "@/utils/utils";
import { useRouter } from "next/navigation";
import CollectionsContext from "@/contexts/CollectionsContext";
function ContentModelDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { collections, updateCollection, fetchCollections } =
    useContext(CollectionsContext);
  const [submitted, setSubmitted] = useState(false);
  const closeDialogButtonRef = useRef<HTMLButtonElement | null>(null);
  const {
    values,
    errors,
    isValid,
    handleChange,
    setValues,
    setErrors,
    setIsValid,
  } = useFormWithValidation({
    name: "",
    description: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  const createCollection = async (collectionData: Collection) => {
    // Check if collection name already exists
    const doesNameExist = collections.some(
      (collection) => collection.name === collectionData.name
    );
    if (doesNameExist) {
      toast({
        title: "Error",
        description: "Collection name already exists!",
        variant: "destructive",
      });
      setSubmitted(false); // Reset the submitted state to allow another attempt
      return; // Exit the function early, preventing the API call
    }

    try {
      const newCollection = await addCollection(collectionData);
      // Add the new collection to the state
      updateCollection(newCollection.id, newCollection);
      console.log(newCollection);
      await fetchCollections();

      toast({
        title: "Success",
        description: "You have successfully added a new collection.",
        variant: "success",
      });

      closeDialogButtonRef.current?.click();
      if (newCollection.name) {
        router.push(`/content-type-builder/collections/${newCollection.name}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = getErrors(axiosError);
      console.error("Error adding a new collection:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setSubmitted(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const collectionData: Collection = {
      name: values.name,
      description: values.description,
    };
    setSubmitted(true);
    createCollection(collectionData);
  };

  const resetForm = () => {
    setValues({
      name: "",
      description: "",
    });
    setErrors({});
    setIsValid(false);
    setSubmitted(false);
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    setIsDialogOpen(isOpen);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          id="createNewCollectionButton"
          style={{
            backgroundColor: "transparent",
            color: "#0075FF",
            paddingLeft: "0",
          }}
        >
          &#43; Create new collection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add collection</DialogTitle>
          <DialogDescription>
            Create a new collection type. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form id="collection-form" onSubmit={handleSubmit} noValidate>
          <FormGrid>
            <div className="col-span-full">
              <FormFieldGroup
                label="Name"
                name="name"
                id="name"
                type="text"
                required
                minLength={2}
                maxLength={15}
                value={values.name}
                onChangeInput={handleChange}
                error={errors.name}
                pattern="^[a-zA-Z\s]+$"
              />
            </div>

            <div className="col-span-full">
              <FormFieldGroup
                useTextarea
                label="Description"
                name="description"
                id="description"
                required
                minLength={10}
                maxLength={500}
                value={values.description}
                onChangeTextArea={handleChange}
                error={errors.description}
             

              />
            </div>
          </FormGrid>

          <DialogFooter style={{ paddingTop: "48px" }}>
            <DialogClose ref={closeDialogButtonRef}>
              <Button variant="outline" type="button" id="cancelButton">
                Cancel
              </Button>
            </DialogClose>
            <Button
              id="addCollectionButton"
              type="submit"
              disabled={submitted || !isValid}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ContentModelDialog;
