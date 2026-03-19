import * as React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function ResponsiveDialog({ open, onOpenChange, children }: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {children}
    </Drawer>
  );
}

function ResponsiveDialogContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogContent>) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <DialogContent className={className} {...props}>
        {children}
      </DialogContent>
    );
  }

  return (
    <DrawerContent className={cn('max-h-[85vh] px-4 pb-6', className)}>
      {children}
    </DrawerContent>
  );
}

function ResponsiveDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? (
    <DialogHeader className={className} {...props} />
  ) : (
    <DrawerHeader className={cn('text-left', className)} {...props} />
  );
}

function ResponsiveDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? (
    <DialogFooter className={className} {...props} />
  ) : (
    <DrawerFooter className={cn('px-0', className)} {...props} />
  );
}

function ResponsiveDialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogTitle>) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? (
    <DialogTitle className={className} {...props} />
  ) : (
    <DrawerTitle className={className} {...props} />
  );
}

function ResponsiveDialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogDescription>) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? (
    <DialogDescription className={className} {...props} />
  ) : (
    <DrawerDescription className={className} {...props} />
  );
}

function ResponsiveDialogClose({
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogClose>) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? <DialogClose {...props} /> : <DrawerClose {...props} />;
}

export {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogClose,
};
