"use client";

import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useToast } from "./ui/use-toast";

interface SubScriptionButtonProps {
  className?: string;
  isPro?: boolean;
}

const SubScriptionButton: React.FC<SubScriptionButtonProps> = ({
  isPro,
  className,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleSubcribe = async () => {
    try {
      setLoading(true);

      if (isPro) {
        const { data } = await axios.post("/api/stripe-customer-portal");
        window.location.href = data.url;
      } else {
        const { data } = await axios.get("/api/stripe");
        window.location.href = data.url;
      }
    } catch (error) {
      toast({ variant: "destructive", description: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant={"outline"}
        size={"lg"}
        disabled={loading}
        onClick={handleSubcribe}
        className={cn(
          "text-white font-semibold w-full border-none gradient-btn",
          "hover:text-white"
        )}
      >
        <span>{isPro ? "Manage Subscription" : "Upgrade to Pro"}</span>
        <Sparkles />
      </Button>
    </div>
  );
};

export default SubScriptionButton;
