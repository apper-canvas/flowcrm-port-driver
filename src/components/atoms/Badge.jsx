import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary border border-secondary/20",
    success: "bg-gradient-to-r from-success/10 to-green-500/10 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-yellow-500/10 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-600/10 text-error border border-error/20",
    lead: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200",
    qualified: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200",
    proposal: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200",
    negotiation: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-200",
    closed: "bg-gradient-to-r from-success/10 to-green-500/10 text-success border border-success/20"
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;