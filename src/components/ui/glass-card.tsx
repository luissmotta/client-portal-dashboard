import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function GlassCard({ className, children, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-panel rounded-[22px] p-6 text-white transition-all",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
