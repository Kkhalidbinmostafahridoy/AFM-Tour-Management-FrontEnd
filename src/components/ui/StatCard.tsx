import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow bg-background/50 backdrop-blur-xl border-white/20 dark:border-gray-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p
              className={`text-xs mt-1 ${
                trend === "up"
                  ? "text-emerald-500"
                  : trend === "down"
                  ? "text-rose-500"
                  : "text-muted-foreground"
              }`}
            >
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
