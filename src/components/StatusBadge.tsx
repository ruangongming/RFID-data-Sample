import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: "success" | "error" | "pending";
  children?: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const variants = {
    success: {
      icon: <CheckCircle2 className="h-3 w-3" />,
      className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
    },
    error: {
      icon: <XCircle className="h-3 w-3" />,
      className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
    },
    pending: {
      icon: <Clock className="h-3 w-3" />,
      className: "bg-accent/10 text-accent hover:bg-accent/20 border-accent/20",
    },
  };

  const variant = variants[status];

  return (
    <Badge variant="outline" className={variant.className}>
      <span className="flex items-center gap-1.5">
        {variant.icon}
        {children}
      </span>
    </Badge>
  );
}