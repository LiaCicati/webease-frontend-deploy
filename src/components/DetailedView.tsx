import SettingsTabs from "./SettingsTabs";
import { SettingsTabsProps } from "./SettingsTabs";

function DetailedView(props: SettingsTabsProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 ">
        Add new {props.selectedField.label}
      </h1>
      <p className="text-gray-600 leading-relaxed">
        {props.selectedField.description}
      </p>

      <SettingsTabs {...props} />
    </div>
  );
}

export default DetailedView;
