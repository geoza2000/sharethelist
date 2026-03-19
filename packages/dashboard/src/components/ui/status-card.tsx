import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function StatusCard({
  icon,
  title,
  description,
  children,
  className,
  contentClassName,
}: StatusCardProps) {
  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className="text-center">
        {icon && <div className="mx-auto mb-2">{icon}</div>}
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
}
