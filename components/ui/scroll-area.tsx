"use client";

import * as React from "react";
import { Root as RadixScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils"; 

export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof RadixScrollArea> {}

const ScrollArea = React.forwardRef<React.ElementRef<typeof RadixScrollArea>, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <RadixScrollArea ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
      <div className="h-full w-full overflow-auto">{children}</div>
      <Scrollbar orientation="vertical" />
    </RadixScrollArea>
  )
);

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
