import { cn } from "@/lib/utils";

export function Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-light tracking-tight lg:text-5xl transition-all",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function Subtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xl text-muted-foreground font-light leading-7",
        className
      )}
    >
      {children}
    </p>
  );
}