'use client';

import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useSession } from '@clerk/nextjs';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const { isLoaded } = useAuth();
  const { session } = useSession();

  return (
    <main className="p-3 xl:p-4 w-full overflow-hidden">
      <Card className="flex-1 p-0 xl:p-6 border-0 xl:border shadow-none xl:shadow-sm">
        <CardHeader className="px-0 xl:px-6">
          <CardTitle className="text-2xl md:text-3xl">Welcome back{isLoaded && `, ${session!.user.firstName}`}</CardTitle>
          <CardDescription>Check your documents and multimedia. Or just ask AI!</CardDescription>
        </CardHeader>
        <CardFooter className="gap-3 px-0 xl:px-6">
          <CardAction className="hidden lg:block">
            <Link href="/documents">
              <Button
                variant="secondary"
                className="cursor-pointer"
              >
                Check Documents
                <ArrowRightIcon />
              </Button>
            </Link>
          </CardAction>
          <CardAction className="hidden lg:block">
            <Link href="/multimedia">
              <Button
                variant="secondary"
                className="cursor-pointer"
              >
                Check Multimedia
                <ArrowRightIcon />
              </Button>
            </Link>
          </CardAction>
          <CardAction className="w-full lg:w-fit">
            <Link href="/baldomero">
              <Button
                variant="secondary"
                className="cursor-pointer w-full lg:w-fit"
              >
                Chat with Baldomero
                <ArrowRightIcon />
              </Button>
            </Link>
          </CardAction>
        </CardFooter>
      </Card>
    </main>
  );
}
