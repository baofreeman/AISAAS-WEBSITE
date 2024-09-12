import { NAVIGATIONS } from "@/contants";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { isMinimal, handleClose } = useSidebarStore();
  const pathname = usePathname();
  return (
    <div className="px-4">
      {NAVIGATIONS.map(({ title, url, icon }) => (
        <div key={url} className="mb-2">
          <Link href={url} onClick={handleClose}>
            <div
              className={cn(
                "flex items-center py-1 rounded-lg px-5 opacity-70",
                "hover:opacity-100",
                isMinimal && "px-1",
                pathname.includes(url) &&
                  "transition-colors bg-card-foreground opacity-100"
              )}
            >
              <div className="flex items-center p-2">
                <div>
                  <Image width={24} height={24} src={icon} alt={title} />
                </div>
                {!isMinimal && <span className="ml-4 text-sm">{title}</span>}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
