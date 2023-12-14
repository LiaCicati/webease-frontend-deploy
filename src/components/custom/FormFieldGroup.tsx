import React, { Ref } from "react";
import { useState } from "react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { FaExclamationCircle } from "react-icons/fa";
import { Textarea } from "@/components/ui/Textarea";

interface FormFieldGroupProps {
  label: string;
  name: string;
  id: string;
  type?: string;
  required?: boolean;
  readonly?: boolean;
  value?: string;
  defaultValue?: string;
  onChangeInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeTextArea?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  useTextarea?: boolean;
  rows?: number;
  cols?: number;
  ref?: Ref<HTMLInputElement> | undefined;
  step?: string | number;
  minValue?: number;
  maxValue?: number;
  placeholder?: string;
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  label,
  name,
  id,
  type,
  required,
  readonly,
  value,
  defaultValue,
  onChangeInput,
  error,
  minLength,
  maxLength,
  pattern,
  useTextarea,
  onChangeTextArea,
  rows,
  cols,
  ref,
  step,
  minValue,
  maxValue,
  placeholder,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowTooltip(!showTooltip);
  };
  return (
    <>
      <Label htmlFor={id}>{label}</Label>

      {useTextarea ? (
        <Textarea
          name={name}
          id={id}
          required={required}
          value={value}
          onChange={onChangeTextArea}
          rows={rows}
          cols={cols}
          className="mt-2"
          minLength={minLength}
          maxLength={maxLength}

          // ... other props for Textarea
        />
      ) : (
        <Input
          type={type}
          name={name}
          id={id}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={onChangeInput}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          ref={ref}
          readOnly={readonly}
          step={step}
          min={minValue}
          max={maxValue}
          placeholder={placeholder}
        />
      )}

      {error && (
        <button
          id="error-button"
          className="mt-2 text-red-500 cursor-pointer relative p-1 border border-red-500 rounded hover:bg-red-100 focus:outline-none"
          onClick={handleIconClick}
        >
          <FaExclamationCircle />
          {showTooltip && (
            <div
              id="error-tooltip"
              className=" absolute left-full top-0 mt-0 ml-2 w-48 p-2 bg-white text-sm text-red-500 border border-red-500 rounded-md shadow-md z-10"
            >
              {error}
            </div>
          )}
        </button>
      )}
    </>
  );
};

export default FormFieldGroup;
