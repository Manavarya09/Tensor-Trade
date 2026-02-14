import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-xl border border-gray-200 shadow-sm",
          hover && "transition-all duration-200 hover:shadow-lg hover:scale-105",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export default Card;
