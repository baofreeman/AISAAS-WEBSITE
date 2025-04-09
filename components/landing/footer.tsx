import { cn } from "@/lib/utils";
import Logo from "../logo";

const Footer = () => {
  return (
    <footer className="border-t w-full p-4">
      <div
        className={cn(
          "max-w-screen-xl mx-auto flex flex-col items-center justify-between",
          "lg:flex-row"
        )}
      >
        <Logo />
        <div className={cn("text-sm mt-4 text-gray-500", "lg:mt-0")}>
          <p>&copy; 2024 Freeman. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
