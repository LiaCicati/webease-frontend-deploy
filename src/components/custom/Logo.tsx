import Image from "next/image";
import logoNoText from "../../../public/images/logo-notext.svg";
import logoText from "../../../public/images/logo.svg";
import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  variant?: "noText" | "withText";
}

const Logo: React.FC<LogoProps> = ({
  width = 60,
  height = 60,
  variant = "noText",
}) => {
  const logoSrc = variant === "noText" ? logoNoText : logoText;
  return (
    <div>
      <Image src={logoSrc} alt="Logo" width={width} height={height} />
    </div>
  );
};

export default Logo;
