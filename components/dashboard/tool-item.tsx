"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface ToolItemProps {
  icon: string;
  title: string;
  url: string;
  color?: string;
  slug: "audio" | "video" | "photo" | "conversation";
}
const toolItemColorVariants = cva("absolute inset-0 opacity-20 rounded-xl", {
  variants: {
    color: {
      audio: "bg-orange-500",
      video: "bg-amber-500",
      photo: "bg-violet-500",
      conversation: "bg-blue-500",
    },
  },
  defaultVariants: {
    color: "video",
  },
});

const ToolItem: React.FC<ToolItemProps> = ({ icon, slug, title, url }) => {
  return (
    <div
      className={cn(
        "group flex items-center p-3.5 border rounded-xl transition-all",
        "hover:border-transparent hover:shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0px_2rem_1.5rem_-1rem_rgba(0,0,0,0.12)] 2xl:p-2.5 lg:p-3.5",
        "lg:p-3.5",
        "2xl:p-2.5"
      )}
    >
      <Link href={url} className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-6 rounded-lg p-1 w-16 h-auto relative flex justify-center">
              <div className={cn(toolItemColorVariants({ color: slug }))} />
              <Image width={24} height={24} src={icon} alt={title} />
            </div>
            <span className="font-medium">{title}</span>
          </div>
          <ArrowRight />
        </div>
      </Link>
    </div>
  );
};

export default ToolItem;
