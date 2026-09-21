import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function StatCardRoot({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="flex items-start justify-between gap-3">
        {children}
      </CardContent>
    </Card>
  );
}

function StatCardText({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-1">{children}</div>;
}

function StatCardLabel({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function StatCardValue({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-2xl font-semibold tabular-nums", className)}>{children}</p>;
}

function StatCardIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4.5">
      {children}
    </div>
  );
}

export const StatCard = Object.assign(StatCardRoot, {
  Text: StatCardText,
  Label: StatCardLabel,
  Value: StatCardValue,
  Icon: StatCardIcon,
});
