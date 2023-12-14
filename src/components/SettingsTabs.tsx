import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import FormFieldGroup from "./custom/FormFieldGroup";
import { getStepValue } from "@/utils/utils";
type CheckboxStateValues = boolean | string;
export type SettingsTabsProps = {
  selectedField: any;
  values: Record<string, any>;
  errors: Record<string, string>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  numberFormat: string | undefined;
  setNumberFormat: React.Dispatch<React.SetStateAction<string>>;
  textType: string;
  setTextType: React.Dispatch<React.SetStateAction<string>>;
  dateType: string | undefined;
  setDateType: React.Dispatch<React.SetStateAction<string>>;
  checkboxStates: Record<string, CheckboxStateValues>;
  handleCheckboxChange: (name: string, checked: CheckboxStateValues) => void;
};

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  selectedField,
  values,
  errors,
  handleChange,
  numberFormat,
  setNumberFormat,
  textType,
  setTextType,
  dateType,
  setDateType,
  checkboxStates,
  handleCheckboxChange,
}) => {
  return (
    <Tabs defaultValue="basic">
      <TabsList className="flex justify-end">
        <TabsTrigger value="basic">Basic settings</TabsTrigger>
        <TabsTrigger id="advanced" value="advanced">
          Advanced settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <div className=" mb-6 w-[400px]">
          <FormFieldGroup
            label="Name"
            name="name"
            id="name"
            type="text"
            required
            maxLength={20}
            minLength={2}
            pattern="^[a-zA-Z\s]+$"
            value={values.name}
            onChangeInput={handleChange}
            error={errors.name}
          />
        </div>

        {selectedField && selectedField.label === "Text" && (
          <div>
            <Label className="flex mb-4">Type</Label>
            <RadioGroup
              id="type"
              name="type"
              defaultValue="SHORT"
              value={textType}
              className="flex justify-between w-[400px]"
              onValueChange={(value: string) => setTextType(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SHORT" id="short-text" />
                <Label htmlFor="short-text">Short text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="LONG" id="long-text" />
                <Label htmlFor="long-text">Long text</Label>
              </div>
            </RadioGroup>
          </div>
        )}
        {selectedField && selectedField.label === "Number" && (
          <div>
            <Label className="flex mb-4">Number format</Label>
            <Select
              required
              value={numberFormat}
              onValueChange={(value: string) => setNumberFormat(value)}
            >
              <SelectTrigger className="w-[380px]">
                <SelectValue placeholder="Choose here" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="integer" value="INTEGER">
                  integer (ex: 10)
                </SelectItem>
                <SelectItem id="bigInteger" value="BIGINTEGER">
                  big integer (ex: 123456789)
                </SelectItem>
                <SelectItem id="decimal" value="DECIMAL">
                  decimal (ex: 2.22)
                </SelectItem>
                <SelectItem id="float" value="FLOAT">
                  float (ex: 3.33333333)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedField && selectedField.label === "Date" && (
          <div>
            <Label className="flex mb-4">Type</Label>
            <Select
              required
              value={dateType}
              onValueChange={(value: string) => setDateType(value)}
            >
              <SelectTrigger className="w-[380px]">
                <SelectValue placeholder="Choose here" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="date" value="DATE">
                  date (ex: 01/01/2023)
                </SelectItem>
                <SelectItem id="dateTime" value="DATETIME">
                  datetime (ex: 01/01/2023 00:00 AM)
                </SelectItem>
                <SelectItem id="time" value="TIME">
                  time (ex: 00:00 AM)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </TabsContent>

      <TabsContent value="advanced">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            name="required"
            id="required"
            checked={!!checkboxStates.required}
            onCheckedChange={(checked) =>
              handleCheckboxChange("required", checked)
            }
          />
          <Label
            htmlFor="required"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Required
          </Label>
        </div>

        {selectedField && selectedField.label === "Text" && (
          <div>
            <div className="col-span-full mb-4">
              <FormFieldGroup
                label="Default value"
                name="defaultValue"
                id="defaultValue"
                type="text"
                value={values.defaultValue}
                onChangeInput={handleChange}
                error={errors.defaultValue}
              />
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="unique"
                name="unique"
                checked={!!checkboxStates.unique}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("unique", checked)
                }
              />
              <Label
                htmlFor="unique"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Unique
              </Label>
            </div>
            <div className="col-span-full mb-4">
              <FormFieldGroup
                label="Maximum Length"
                name="maximumLength"
                id="maximumLength"
                type="number"
                value={values.maximumLength}
                onChangeInput={handleChange}
                error={errors.maximumLength}
                placeholder={
                  textType === "SHORT" ? "Max 50 characters allowed" : ""
                }
              />
              {textType === "SHORT" && (
                <p className="text-sm text-gray-500 mt-1">
                  Maximum length allowed for short text is 50 characters.
                </p>
              )}
            </div>
            <div className="col-span-full">
              <FormFieldGroup
                label="Minimum Length"
                name="minimumLength"
                id="minimumLength"
                type="number"
                value={values.minimumLength}
                onChangeInput={handleChange}
                error={errors.minimumLength}
              />
            </div>
          </div>
        )}
        {selectedField && selectedField.label === "RichText" && (
          <div>
            <div className="col-span-full mb-4">
              <FormFieldGroup
                label="Default value"
                name="defaultValue"
                id="defaultValue"
                type="text"
                value={values.defaultValue}
                onChangeInput={handleChange}
                error={errors.defaultValue}
              />
            </div>

            <div className="col-span-full mb-4">
              <FormFieldGroup
                label="Maximum Length"
                name="maximumRichTextLength"
                id="maximumRichTextLength"
                type="number"
                value={values.maximumRichTextLength}
                onChangeInput={handleChange}
                error={errors.maximumLength}
              />
            </div>
            <div className="col-span-full">
              <FormFieldGroup
                label="Minimum Length"
                name="minimumLength"
                id="minimumLength"
                type="number"
                value={values.minimumLength}
                onChangeInput={handleChange}
                error={errors.minimumLength}
              />
            </div>
          </div>
        )}

        {selectedField && selectedField.label === "Number" && (
          <div>
            <div className="col-span-full mb-4">
              <FormFieldGroup
                label="Default value"
                name="defaultValue"
                id="defaultValue"
                type="number"
                value={values.defaultValue}
                onChangeInput={handleChange}
                error={errors.defaultValue}
                step={getStepValue(numberFormat || "INTEGER")}
              />
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="unique"
                checked={!!checkboxStates.unique}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("unique", checked)
                }
              />
              <Label
                htmlFor="unique"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Unique
              </Label>
            </div>
            <div className="col-span-full mb-4">
              <FormFieldGroup
                label="Maximum Value"
                name="maximumValue"
                id="maximumValue"
                type="number"
                value={values.maximumValue}
                onChangeInput={handleChange}
                error={errors.maximumValue}
              />
            </div>
            <div className="col-span-full">
              <FormFieldGroup
                label="Minimum Value"
                name="minimumValue"
                id="minimumValue"
                type="number"
                value={values.minimumValue}
                onChangeInput={handleChange}
                error={errors.minimumValue}
              />
            </div>
          </div>
        )}

        {selectedField && selectedField.label === "Date" && (
          <div>
            <div className="col-span-full mb-4">
              <FormFieldGroup
                label="Default value"
                name="defaultValue"
                id="defaultValue"
                type={
                  dateType === "DATE"
                    ? "date"
                    : dateType === "DATETIME"
                    ? "datetime-local"
                    : "time"
                }
                value={values.defaultValue}
                onChangeInput={handleChange}
                error={errors.defaultValue}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unique"
                checked={!!checkboxStates.unique}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("unique", checked)
                }
              />
              <Label
                htmlFor="unique"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Unique
              </Label>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
