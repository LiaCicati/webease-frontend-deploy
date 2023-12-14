"use client";
import React, { useState, useEffect } from "react";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import FormGrid from "@/components/custom/FormGrid";
import { Button } from "@/components/ui/Button";
import { getCollectionByApiId } from "@/services/CollectionService";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { getInputType } from "@/utils/utils";
import ReactQuill from "react-quill";
import { FaExclamationCircle } from "react-icons/fa";
import "react-quill/dist/quill.snow.css";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { getStepValue } from "@/utils/utils";
import { deletePost, getPostById, updatePost } from "@/services/PostService";
import { Post } from "@/models/Post";
import { getUserById } from "@/services/UserService";
import { User } from "@/models/User";
import { Attribute } from "@/models/Attribute";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { getErrors } from "@/utils/utils";
import { Collection } from "@/models/Collection";
import DeletePostDialog from "@/components/custom/DeletePostDialog";

type FormValues = {
  [key: string ]: string;
};

const PostDetailsPage = ({ params }: Params) => {
  const router = useRouter();
  const { toast } = useToast();
  const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation<FormValues>({});
  const [collection, setCollection] = useState<Collection>();
  const [error, setError] = useState("");
  const { contentType, postId } = params;
  const [post, setPost] = useState<Post>();
  const [user, setUser] = useState<User>();
  const [richTextFieldValues, setRichTextFieldValues] = useState<
    Record<string, string>
  >({});

  const [richTextErrors, setRichTextErrors] = useState<Record<string, string>>(
    {}
  );
  const [richTextFieldsValidity, setRichTextFieldsValidity] = useState({});
  const [showRichTextErrorTooltip, setShowRichTextErrorTooltip] =
    useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(isValid);

  const toggleRichTextErrorTooltip = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setShowRichTextErrorTooltip(!showRichTextErrorTooltip);
  };

  const validateForm = () => {
    if (!collection) {
      return false;
    }

    // Check regular fields validity
    const regularFieldsValid = collection.attributes.every((attr) => {
      if (attr.contentType !== "RICHTEXT" && attr.required) {
        return values[attr.name] && !errors[attr.name];
      }
      return true;
    });

    // Check rich text fields validity
    const richTextFieldsValid = collection.attributes.every((attr) => {
      if (attr.contentType === "RICHTEXT" && attr.required) {
        const content = richTextFieldValues[attr.name] || "";
        const isEmpty = content.replace(/<[^>]*>/g, "").trim() === "";
        return !isEmpty;
      }
      return true;
    });

    return regularFieldsValid && richTextFieldsValid;
  };

  useEffect(() => {
    if (contentType) {
      getCollectionByApiId(contentType)
        .then((data) => {
          setCollection(data);
        })
        .catch((error) => {
          setError(error.message || "An error occurred");
        });
    }
  }, [contentType]);

  useEffect(() => {
    if (postId && collection) {
      getPostById(postId)
        .then((data) => {
          if (data.userId) {
            getUserById(data.userId)
              .then((userData) => {
                setUser(userData);
              })
              .catch((error) => {
                console.error("Error fetching user data:", error);
              });
          }

          // Merges content types from the collection into post attributes
          const mergedAttributes = collection.attributes.map(
            (collectionAttr: any) => {
              const postAttr = data.attributes[collectionAttr.name];
              return {
                name: collectionAttr.name,
                value: postAttr ? postAttr : "", // Uses existing value or initializes to empty
                contentType: collectionAttr.contentType,
              };
            }
          );
          const attributesRecord: Record<string, Attribute> = {};
          mergedAttributes.forEach(attr => {
            attributesRecord[attr.name] = { ...attr };
          });
          
          setPost({ ...data, attributes: attributesRecord });
          const initialValues: FormValues = {};

          mergedAttributes.forEach((attr) => {
            initialValues[attr.name] = String(attr.value) || "";
          });

          setValues(initialValues);

          const richTextValues: FormValues = {};
          mergedAttributes.forEach((attr) => {
            if (attr.contentType === "RICHTEXT") {
              if (typeof attr.value === 'string') {
                richTextValues[attr.name] = attr.value;
              } else {
                // Handle the case where attr.value is not a string
              }
            }
            
          });

          setRichTextFieldValues(richTextValues);
          const isFormNowValid = validateForm();
          setIsFormValid(isFormNowValid);
        })
        .catch((error) => {
          setError(
            error.message || "An error occurred while fetching the post"
          );
        });
    }
  }, [postId, collection]);

  const handleBackClick = () => {
    router.back();
  };

  const validateRichTextField = (
    attributeId: string,
    content: string,
    isRequired: boolean | string,
    minLength: number,
    maxLength: number
  ) => {
    const isEmpty = content === "<p><br></p>" || content.trim() === "";
    const contentLength = content.trim().length;

    let errorMessage = "";
    if (isRequired && isEmpty) {
      errorMessage = "This field is required.";
    } else if (
      minLength !== undefined &&
      minLength !== null &&
      contentLength < minLength
    ) {
      errorMessage = `Minimum length of ${minLength} characters required.`;
    } else if (
      maxLength !== undefined &&
      maxLength !== null &&
      contentLength > maxLength
    ) {
      errorMessage = `Maximum length of ${maxLength} characters exceeded.`;
    }

    const valid = !errorMessage;
    setRichTextFieldsValidity((prevState) => ({
      ...prevState,
      [attributeId]: valid,
    }));

    setRichTextErrors((prevErrors) => ({
      ...prevErrors,
      [attributeId]: errorMessage,
    }));

    setIsFormValid(validateForm());
  };

  const handleRichTextFieldChange = (
    attributeName: string,
    content: string
  ) => {
    const attribute = collection?.attributes.find(
      (attr) => attr.name === attributeName
    );
    if (attribute) {
      setRichTextFieldValues((prev) => ({ ...prev, [attributeName]: content }));
      validateRichTextField(
        attribute.attributeId!,
        content,
        attribute.required ?? false,
        attribute.minimumLength ?? 0,
        attribute.maximumLength ?? Infinity
      );
    }
  };

  const renderFormField = (attribute: Attribute) => {
    if (!collection) {
      console.error(`Collection ${collection} not found`);
      return null;
    }

    const collectionAttribute = collection.attributes.find(
      (attr) => attr.name === attribute.name
    );
    if (!collectionAttribute) {
      console.error(`Attribute ${attribute.name} not found in collection`);
      return null;
    }
    const stepValue = getStepValue(collectionAttribute.formatType || "any");
    const dateInputType = getInputType(
      attribute.contentType,
      collectionAttribute.dateType || "DATE"
    );

    const useTextarea = collectionAttribute.textType === "LONG";
    const isRequired = collectionAttribute.required;

    const label = `${collectionAttribute.name}${isRequired ? " *" : ""}`;
    switch (attribute.contentType) {
      case "TEXT":
        if (useTextarea)
          return (
            <FormGrid>
              <div key={attribute.name} className="sm:col-span-3">
                <FormFieldGroup
                  label={label}
                  name={attribute.name}
                  id={attribute.name}
                  useTextarea={true}
                  type={getInputType(attribute.contentType)}
                  value={values[attribute.name] || ""}
                  onChangeTextArea={handleChange}
                  required={collectionAttribute.required? true : false}
                  minLength={collectionAttribute.minimumLength}
                  maxLength={collectionAttribute.maximumLength}
                  error={errors[attribute.name] || ""}
                />
              </div>
            </FormGrid>
          );

      case "NUMBER":
        return (
          <FormGrid>
            <div key={attribute.name} className="sm:col-span-3">
              <FormFieldGroup
                label={label}
                name={attribute.name}
                id={attribute.name}
                type={getInputType(attribute.contentType)}
                value={values[attribute.name] || ""}
                onChangeInput={handleChange}
                required={collectionAttribute.required? true : false}
                minValue={collectionAttribute.minimumLength}
                maxValue={collectionAttribute.maximumLength}
                error={errors[attribute.name] || ""}
                step={stepValue}
              />
            </div>
          </FormGrid>
        );
      case "DATE":
        return (
          <FormGrid>
            <div key={attribute.name} className="sm:col-span-3">
              <FormFieldGroup
                label={label}
                name={attribute.name}
                id={attribute.name}
                type={dateInputType}
                value={values[attribute.name] || ""}
                onChangeInput={handleChange}
                required={collectionAttribute.required? true : false}
              />
            </div>
          </FormGrid>
        );
      case "RICHTEXT":
        return (
          <div
            key={collectionAttribute.attributeId}
            className="sm:col-span-3 mt-4"
          >
            <label>{label}</label>
            <div className="p-2">
              <div className="max-w-4xl bg-white">
                <ReactQuill
                  theme="snow"
                  value={richTextFieldValues[attribute.name] || ""}
                  onChange={(content) =>
                    handleRichTextFieldChange(attribute.name, content)
                  }
                />
              </div>
            </div>
            {richTextErrors[collectionAttribute.attributeId!] && (
              <button
                className="mt-2 text-red-500 cursor-pointer relative p-1 border border-red-500 rounded hover:bg-red-100 focus:outline-none"
                onClick={toggleRichTextErrorTooltip}
              >
                <FaExclamationCircle />
                {showRichTextErrorTooltip && (
                  <div className="absolute left-full top-0 mt-0 ml-2 w-48 p-2 bg-white text-sm text-red-500 border border-red-500 rounded-md shadow-md z-10">
                    {richTextErrors[collectionAttribute.attributeId!]}
                  </div>
                )}
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const updatePostDetails = async (postData: any) => {
    if (!collection) {
      console.error("Collection is null");
      toast({
        title: "Error",
        description: "No collection data available.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePost(collection.id, postId, postData);
      toast({
        title: "Success",
        description: "Post updated successfully.",
        variant: "success",
      });
      setSubmitted(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = getErrors(axiosError);
      console.error("Error updating post:", errorMessage);
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
    setSubmitted(true);

    if (!collection || !postId) {
      console.error("Collection or Post ID is missing");
      return;
    }

    // Converting number fields from string to number
    const convertedValues: Record<string, string | number> = { ...values };
    collection.attributes.forEach((attribute) => {
      if (
        attribute.contentType === "NUMBER" &&
        convertedValues[attribute.name]
      ) {
        convertedValues[attribute.name] = Number(
          convertedValues[attribute.name]
        );
      }
    });

    const combinedValues = {
      ...convertedValues,
      ...richTextFieldValues,
    };

    const payload = {
      attributes: combinedValues,
    };

    updatePostDetails(payload);
  };

  useEffect(() => {
    const isFormNowValid = validateForm();
    setIsFormValid(isFormNowValid);
  }, [values, errors, richTextFieldValues, collection]);

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      toast({
        title: "Post Deleted",
        description: "The post has been successfully deleted.",
        variant: "success",
      });
      router.push(`/content-manager/collections/${collection?.name}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = getErrors(axiosError);
      console.error("Error deleting post:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="md:flex">
      <div className="flex-grow md:ml-72 mt-4">
        <div className="flex flex-col md:flex-row p-8">
          {/* Form Section */}
          <div className="flex-grow">
            <div className="mb-4">
              <Button
                variant="link"
                onClick={handleBackClick}
                className="text-blue-600 hover:text-blue-700 focus:outline-none transition duration-150 ease-in-out"
              >
                ← Back
              </Button>
            </div>
            <div className="flex justify-between items-start mb-6">
              {collection && (
                <div>
                  <h1 className="text-2xl font-bold">{collection.name}</h1>
                  <p className="text-sm text-gray-600">
                    API ID: {collection.name}
                  </p>
                </div>
              )}
            </div>
            <form
              onSubmit={handleSubmit}
              id="entry-form"
              className="bg-white p-6 sm:p-8 md:p-10 rounded-md shadow-lg"
              noValidate
            >
              <div className="flex items-center space-x-2">
                <Button
                  disabled={submitted || !isFormValid}
                  className="ml-auto"
                >
                  Update
                </Button>
              </div>
              {post ? (
              post.attributes && Object.entries(post.attributes).map(([key, attribute]) => {
                return renderFormField(attribute);
              })
              
              ) : (
                <p>Loading or no post data...</p> // Fallback content
              )}
            </form>

            <div className="mt-4">
              <DeletePostDialog
                postId={postId}
                onDelete={(postId) => {
                  handleDeletePost(postId);
                }}
              />
            </div>
          </div>
          {/* Sidebar Section */}
          <div className="  p-8 border-l self-center">
            <div className="flex justify-between items-center mb-6"></div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900">
                  INFORMATION
                </h3>
              </div>
              <div className="text-xs text-gray-600">
                <p>Created by</p>
                <span>
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
