"use client";
type Params = {
  params: {
    contentType: string;
  };
};
import { ArrowLeftIcon } from "lucide-react";
import React, { useState, useCallback, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { Attribute, AttributeType } from "@/models/Attribute";
import { Button } from "@/components/ui/Button";
import { fields } from "@/utils/constants";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { addAttributeToCollection } from "@/services/ContentModelService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import DetailedView from "@/components/DetailedView";
import GridView from "@/components/GridView";
import { CollectionFieldsTable } from "@/components/CollectionFieldsTable";
import CollectionsContext from "@/contexts/CollectionsContext";
import { AxiosError } from "axios";
import { DateType, getErrors } from "@/utils/utils";
export default function ContentTypePage({ params }: Params) {
  const { contentType } = params;

  const { collections, updateCollection } = useContext(CollectionsContext);

  type CheckboxStateValues = boolean | string;
  const [checkboxStates, setCheckboxStates] = useState<
    Record<string, CheckboxStateValues>
  >({});

  function handleCheckboxChange(name: string, checked: CheckboxStateValues) {
    console.log(name, checked);
    setCheckboxStates((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  }
  const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation({
      name: "",
      minimumLength: "",
      maximumLength: "",
      maximumRichTextLength: "",
      minimumValue: "",
      maximumValue: "",
      defaultValue: "",
    });

  const [selectedFieldType, setSelectedFieldType] =
    useState<AttributeType | null>(null);
  const [numberFormat, setNumberFormat] = useState<string>("INTEGER");
  const [dateType, setDateType] = useState<DateType>("DATE");

  const [fieldsData, setFieldsData] = useState<Attribute[]>([]);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState("grid"); // 'grid' or 'detail'
  const [selectedField, setSelectedField] = useState(null);
  const [textType, setTextType] = useState<string>("SHORT");
  const handleCardClick = useCallback((field: any) => {
    setSelectedField(field);
    setCurrentView("detail");
    setSelectedFieldType(field.label.toUpperCase());
  }, []);

  // Function to create a new field object
  const createNewField = () => ({
    name: values.name,
    textType: textType,
    dateType: dateType,
    contentType: selectedFieldType,
    formatType: numberFormat,
    required: checkboxStates.required || false,
    unique: checkboxStates.unique || false,
    minimumLength: parseInt(values.minimumLength) || undefined,
    maximumLength: parseInt(values.maximumLength) || undefined,
    maximumRichTextLength: values.maximumRichTextLength,
    minimumValue: parseFloat(values.minimumValue) || undefined,
    maximumValue: parseFloat(values.maximumValue) || undefined,
    defaultValue: values.defaultValue,
  });

  // Function to handle successful submission
  const onSuccessfulSubmission = async (newField) => {
    await addAttributeToCollection(selectedContentType.id, newField);
    setFieldsData((prevFields) => [...prevFields, newField]);
    updateCollection(selectedContentType.id, newField);

    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Field added successfully.",
      variant: "success",
    });
    resetDialog();
  };

  // Function to handle errors
  const handleError = (error) => {
    const axiosError = error as AxiosError;
    const errorMessage = getErrors(axiosError);
    console.error("Error adding new field:", error);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFieldType) {
      const newField = createNewField();
      try {
        await onSuccessfulSubmission(newField);
      } catch (error) {
        handleError(error);
      }
    } else {
      toast({
        title: "Error",
        description: "Please select a field type.",
        variant: "destructive",
      });
    }
  };

  const selectedContentType = collections.find(
    (item) => item.name === contentType
  );
  if (!selectedContentType) {
    console.log("no data");
  }

  const attributes: Attribute[] = selectedContentType
    ? selectedContentType.attributes
    : [];

  function resetDialog() {
    setCurrentView("grid");
    setSelectedField(null);
    setSelectedFieldType(null);
    setValues({
      name: "",
      minimumLength: "",
      maximumLength: "",
      maximumRichTextLength: "",
      minimumValue: "",
      maximumValue: "",
      defaultValue: "",
    });
    setCheckboxStates({});
    setNumberFormat("INTEGER");
    setDateType("DATE");
  }

  return (
    <>
      {selectedContentType && (
        <div className="flex-grow md:ml-72 mt-4">
          <h2>{selectedContentType.name}</h2>
          <p>{selectedContentType.description}</p>
          <div className="pl-56 pr-56">
            <div className="mt-6">
              <div className="container mx-auto py-10">
                <CollectionFieldsTable
                  attributes={attributes}
                  onAddFieldClick={() => setIsDialogOpen(true)}
                />
                <Dialog
                  open={isDialogOpen}
                  onOpenChange={() => {
                    if (isDialogOpen) {
                      resetDialog();
                    }
                    setIsDialogOpen(!isDialogOpen);
                  }}
                >
                  <DialogContent className="w-full max-w-xl sm:max-w-3xl">
                    <form onSubmit={handleSubmit} noValidate>
                      <DialogHeader className="flex justify-between">
                        {currentView === "grid" ? (
                          <>
                            <DialogTitle>
                              {selectedContentType.name}
                            </DialogTitle>
                            <DialogDescription>
                              Select a field for your collection type
                            </DialogDescription>
                          </>
                        ) : (
                          <div className="flex items-center">
                            <button
                              className="text-sm text-blue-600 hover:underline mr-2"
                              onClick={() => {
                                setCurrentView("grid");
                                setSelectedField(null);
                                resetDialog();
                              }}
                            >
                              <ArrowLeftIcon />
                            </button>
                            <DialogTitle>
                              {selectedContentType.name}
                            </DialogTitle>
                          </div>
                        )}
                      </DialogHeader>

                      {currentView === "grid" ? (
                        <GridView
                          fields={fields}
                          onCardClick={handleCardClick}
                        />
                      ) : (
                        <>
                          <DetailedView
                            textType={textType}
                            setTextType={setTextType}
                            selectedField={selectedField}
                            values={values}
                            errors={errors}
                            handleChange={handleChange}
                            numberFormat={numberFormat}
                            setNumberFormat={setNumberFormat}
                            dateType={dateType}
                            setDateType={setDateType}
                            checkboxStates={checkboxStates}
                            handleCheckboxChange={handleCheckboxChange}
                          />
                          <DialogFooter>
                            <DialogClose>
                              <Button
                                variant="outline"
                                type="button"
                                id="cancelButton"
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              id="finishButton"
                              type="submit"
                              disabled={!isValid}
                            >
                              Finish
                            </Button>
                          </DialogFooter>
                        </>
                      )}
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
