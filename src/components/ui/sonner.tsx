import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-white text-[#171C25] border border-[#DDE6EC] shadow-[0_14px_40px_rgba(19,31,49,0.16)]",
          title:
            "text-[#171C25] font-semibold",
          description:
            "text-[#667181]",
          actionButton:
            "bg-[#171C25] text-white",
          cancelButton:
            "bg-[#EEF2F5] text-[#667181]",
          closeButton:
            "bg-white border border-[#DDE6EC] text-[#667181]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };