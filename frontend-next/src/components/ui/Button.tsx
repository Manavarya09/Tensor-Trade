import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl":
              variant === "primary",
            "bg-gray-800 text-white hover:bg-gray-700": variant === "secondary",
            "border-2 border-blue-600 text-blue-600 hover:bg-blue-50":
              variant === "outline",
            "hover:bg-gray-100 text-gray-700": variant === "ghost",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-6 py-2.5 text-base": size === "md",
            "px-8 py-3 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
