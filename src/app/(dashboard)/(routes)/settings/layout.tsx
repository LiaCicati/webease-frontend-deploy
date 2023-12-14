import SettingsSideBar from "@/components/custom/SettingsSideBar";

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SettingsSideBar />
      {children}
    </div>
  );
};

export default UsersLayout;
