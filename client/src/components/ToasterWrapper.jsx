import { Toaster } from "sonner";
import { useTheme } from "../contexts/ThemeContext";

export const ToasterWrapper = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      theme={theme}
      richColors
      closeButton
      duration={4000}
    />
  );
};
