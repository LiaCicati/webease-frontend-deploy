const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      {children}
    </main>
  );
};

export default LandingLayout;
