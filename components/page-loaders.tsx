import { Loader2Icon } from 'lucide-react';

export function CircleLoader() {
  return (
    <div className="flex-1 min-h-0 flex items-center justify-center">
      <Loader2Icon className="size-14 animate-spin text-muted-foreground" />
    </div>
  );
}
