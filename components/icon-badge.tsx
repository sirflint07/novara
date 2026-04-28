import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";


const backgroundVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-sky-100",
                success: "bg-emerald-100"
            },
            iconVariant: {
                default: "text-sky-700",
                success: "text-emerald-700"
            },
            bgSize: {
                default: "p-1",
                md: "p-2"
            },
            defaultVariants: {
                variant: "default",
                bgSize: "default"
            }
        }
    }
)

const iconVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "text-sky-700",
                success: "text-emerald-700"
            },
            iconSize: {
                default: "size-10",
                sm: "size-6",
                md: "size-4"
            },
            defaultVariants: {
                variant: "default",
                iconSize: "default"
            }
        }
    }
)

type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>
type IconVariantProps = VariantProps<typeof iconVariants>

interface IconBadgeProps {
    icon: LucideIcon
    variant?: BackgroundVariantsProps["variant"] & IconVariantProps["variant"]
    bgSize?: BackgroundVariantsProps["bgSize"],
    iconSize?: IconVariantProps["iconSize"]
}

export const IconBadge = ({
    icon: Icon,
    variant,
    bgSize,
    iconSize
}: IconBadgeProps) => {
    return (
        <div className={cn(backgroundVariants({variant, bgSize}))}>
            <Icon className={cn(iconVariants({ variant, iconSize}))} />
        </div>
    )
}