import { Button } from '@/components/ui/button';
import { MessageSquareIcon } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <section className="w-full flex flex-col justify-center items-center gap-5">
      <div className="flex flex-col gap-3 items-center">
        <p className="text-xl font-semibold">In Construction!</p>
        <p>This page is under construction.</p>
      </div>
      <Link href="/baldomero">
        <Button className="cursor-pointer">
          <MessageSquareIcon />
          Check Messages
        </Button>
      </Link>
    </section>
  );
}
