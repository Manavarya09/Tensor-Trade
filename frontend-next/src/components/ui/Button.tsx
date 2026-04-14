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
          "inline-flex items-center justify-center font-bold uppercase border-4 border-black transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-black text-white hover:bg-white hover:text-black": variant === "primary",
            "bg-white text-black hover:bg-black hover:text-white": variant === "secondary",
            "bg-transparent text-black hover:bg-black hover:text-white": variant === "outline",
            "bg-transparent text-black hover:bg-black hover:text-white border-2": variant === "ghost",
          },
          {
            "px-3 py-1.5 text-xs": size === "sm",
            "px-6 py-2.5 text-sm": size === "md",
            "px-8 py-3 text-base": size === "lg",
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
