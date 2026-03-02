'use client';

import { useState, useEffect } from 'react';
import { useSignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const signInSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

const redirectPage = '/overview';

type SignInFormType = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) router.push(redirectPage);
  }, [isSignedIn, router]);

  const signInForm = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function handleSubmit(data: SignInFormType) {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const signInResult = await signIn.create({
        identifier: data.email,
        password: data.password
      });
      if (signInResult.status === 'complete') {
        await setActive({ session: signInResult.createdSessionId });
        toast.success('You are successfully signed in.');
        setTimeout(() => router.push(redirectPage), 1000);
      } else {
        toast.error('An internal error has ocurred.');
      }
    } catch {
      toast.error('Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-md py-4 xl:py-6">
      <CardHeader className="px-4 lg:px-6">
        <CardTitle>Sign In</CardTitle>
        <CardDescription className="hidden xl:block">Introduce your credentials.</CardDescription>
      </CardHeader>
      <CardContent className="px-4 lg:px-6">
        <Form {...signInForm}>
          <form
            onSubmit={signInForm.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={signInForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signInForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col lg:flex-row gap-2">
        <Label>You don&apos;t have an account?</Label>
        <Link href="/sign-up">
          <Label className="cursor-pointer underline">Sign Up</Label>
        </Link>
      </CardFooter>
    </Card>
  );
}
