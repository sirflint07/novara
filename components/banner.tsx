import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "flex items-center gap-3 px-4 py-4 rounded-lg border text-sm transition-all duration-200",
  {
    variants: {
      variant: {
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        success: "bg-emerald-50 border-emerald-200 text-emerald-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
        error: "bg-red-50 border-red-200 text-red-800",
      },
      size: {
        default: "px-4 py-3",
        sm: "px-3 py-2 text-xs",
        lg: "px-6 py-4 text-base",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "default",
      rounded: "default",
    },
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
  info: Info,
  error: XCircle,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
  description?: string;
  className?: string;
  onDismiss?: () => Boolean;
  icon?: React.ReactNode;
}

export const Banner = ({ 
  label, 
  description,
  variant = "info", 
  size,
  rounded,
  className,
  onDismiss,
  icon,
}: BannerProps) => {
  const Icon = iconMap[variant || "info"];

  return (
    <>
      {
        !onDismiss &&
        <div className={cn(bannerVariants({ variant, size, rounded }), className)}>
        <div className="shrink-0">
          {icon || (
            <Icon className={cn(
              "h-5 w-5",
              variant === "warning" && "text-amber-500",
              variant === "success" && "text-emerald-500",
              variant === "info" && "text-blue-500",
              variant === "error" && "text-red-500",
            )} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium">{label}</p>
          {description && (
            <p className="text-xs opacity-80 mt-0.5">{description}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>}
    </>
    
  );
};