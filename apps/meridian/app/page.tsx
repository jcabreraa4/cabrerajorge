import { SettingsIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

export default function Page() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-3 p-3 md:p-5">
      <SettingsIcon className="size-14" />
      <p className="text-2xl font-semibold">[ Meridian ] CabreraJorge</p>
      <Button>Shadcn Button</Button>
    </main>
  );
}
