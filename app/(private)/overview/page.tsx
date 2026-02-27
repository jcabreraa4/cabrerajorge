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
    <main className="w-full">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">Welcome back{isLoaded && `, ${session!.user.firstName}`}</CardTitle>
          <CardDescription>Check your documents and multimedia. Or just ask AI!</CardDescription>
        </CardHeader>
        <CardFooter className="gap-3">
          <CardAction className="hidden xl:block">
            <Link href="/documents">
              <Button
                variant="secondary"
                className="cursor-pointer"
              >
                Check Documents
                <ArrowRightIcon className="size-4" />
              </Button>
            </Link>
          </CardAction>
          <CardAction className="hidden xl:block">
            <Link href="/multimedia">
              <Button
                variant="secondary"
                className="cursor-pointer"
              >
                Check Multimedia
                <ArrowRightIcon className="size-4" />
              </Button>
            </Link>
          </CardAction>
          <CardAction>
            <Link href="/baldomero">
              <Button
                variant="secondary"
                className="cursor-pointer"
              >
                Chat with AI
                <ArrowRightIcon className="size-4" />
              </Button>
            </Link>
          </CardAction>
        </CardFooter>
      </Card>
    </main>
  );
}
