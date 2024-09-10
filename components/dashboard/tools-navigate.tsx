import { TOOLS } from "@/contants";
import { cn } from "@/lib/utils";
import ToolItem from "./tool-item";

interface ToolsNavigateProps {
  title?: string;
}

const ToolsNavigate: React.FC<ToolsNavigateProps> = ({
  title = "Unlock the power of AI",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full items-center grow px-10 py-20 overflow-auto scroll-smooth scrollbar-none",
        "lg:px-4 lg:pt-0 lg:pb-6",
        "2xl:py-12"
      )}
    >
      <div className="text-center mb-8">
        <h3>{title}</h3>
        <p className="text-muted-foreground text-lg mt-2">
          Chat with the smartest AI
        </p>
      </div>
      <div
        className={cn(
          "w-full px-4 mx-auto space-y-4 overflow-auto",
          "md:px-20 lg:px-32"
        )}
      >
        {TOOLS.map((tool, index) => (
          <ToolItem key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolsNavigate;
