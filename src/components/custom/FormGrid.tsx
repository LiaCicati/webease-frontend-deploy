import React, { ReactNode } from "react";

interface FormGridProps {
  children: ReactNode;
}

const FormGrid: React.FC<FormGridProps> = ({ children }) => (
  <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    {children}
  </div>
);

export default FormGrid;
