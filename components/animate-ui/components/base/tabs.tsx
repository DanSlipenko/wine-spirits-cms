import * as React from "react";

import {
  Tabs as TabsPrimitive,
  TabsList as TabsListPrimitive,
  TabsTab as TabsTabPrimitive,
  TabsPanel as TabsPanelPrimitive,
  TabsPanels as TabsPanelsPrimitive,
  TabsHighlight as TabsHighlightPrimitive,
  TabsHighlightItem as TabsHighlightItemPrimitive,
  type TabsProps as TabsPrimitiveProps,
  type TabsListProps as TabsListPrimitiveProps,
  type TabsTabProps as TabsTabPrimitiveProps,
  type TabsPanelProps as TabsPanelPrimitiveProps,
  type TabsPanelsProps as TabsPanelsPrimitiveProps,
} from "@/components/animate-ui/primitives/base/tabs";
import { cn } from "@/lib/utils";

type TabsProps = TabsPrimitiveProps;

function Tabs({ className, ...props }: TabsProps) {
  return <TabsPrimitive className={cn("flex flex-col gap-2", className)} {...props} />;
}

type TabsListProps = TabsListPrimitiveProps & {
  activeClassName?: string;
};

function TabsList({ className, activeClassName, children, ...props }: TabsListProps) {
  return (
    <TabsListPrimitive
      className={cn("bg-gray-100 text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]", className)}
      {...props}>
      <TabsHighlightPrimitive className={cn("bg-white shadow-primary rounded-full inset-0", activeClassName)}>
        {children}
      </TabsHighlightPrimitive>
    </TabsListPrimitive>
  );
}

type TabsTabProps = TabsTabPrimitiveProps & {
  value: string;
};

function TabsTab({ className, value, children, ...props }: TabsTabProps) {
  return (
    <TabsHighlightItemPrimitive value={value} className="w-full">
      <TabsTabPrimitive
        value={value}
        className={cn(
          "data-[selected]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md w-full px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-500 ease-in-out focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none cursor-pointer hover:text-zinc-900 disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}>
        {children}
      </TabsTabPrimitive>
    </TabsHighlightItemPrimitive>
  );
}

type TabsPanelsProps = TabsPanelsPrimitiveProps;

function TabsPanels(props: TabsPanelsProps) {
  return <TabsPanelsPrimitive {...props} />;
}

type TabsPanelProps = TabsPanelPrimitiveProps;

function TabsPanel({ className, ...props }: TabsPanelProps) {
  return <TabsPanelPrimitive className={cn("flex-1 outline-none", className)} {...props} />;
}

export {
  Tabs,
  TabsList,
  TabsTab,
  TabsPanels,
  TabsPanel,
  type TabsProps,
  type TabsListProps,
  type TabsTabProps,
  type TabsPanelsProps,
  type TabsPanelProps,
};
