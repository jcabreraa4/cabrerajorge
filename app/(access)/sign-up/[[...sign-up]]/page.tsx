'use client';

import { useState, useEffect } from 'react';
import { useSignUp, useAuth } from '@clerk/nextjs';
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

const disabled = true;

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password is too short')
});

const redirectPage = '/overview';

type SignUpFormType = z.infer<typeof signUpSchema>;

export default function SignInPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) router.push(redirectPage);
  }, [isSignedIn, router]);

  const signUpForm = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: ''
    }
  });

  async function handleSubmit(data: SignUpFormType) {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const signUpResult = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name,
        lastName: data.surname
      });
      if (signUpResult.status === 'complete') {
        await setActive({ session: signUpResult.createdSessionId });
        toast.success('You are successfully signed up.');
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

  if (disabled)
    return (
      <Card className="w-md py-4 xl:py-6">
        <CardHeader className="px-4 lg:px-6">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Sign ups are currently disabled.</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col lg:flex-row gap-2">
          <Label>You already have an account?</Label>
          <Link href="/sign-in">
            <Label className="cursor-pointer underline">Sign In</Label>
          </Link>
        </CardFooter>
      </Card>
    );

  return (
    <Card className="w-md py-4 xl:py-6">
      <CardHeader className="px-4 lg:px-6">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription className="hidden xl:block">Introduce your credentials.</CardDescription>
      </CardHeader>
      <CardContent className="px-4 lg:px-6">
        <Form {...signUpForm}>
          <form
            onSubmit={signUpForm.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex gap-3">
              <FormField
                control={signUpForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={signUpForm.control}
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
              control={signUpForm.control}
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
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col lg:flex-row gap-2">
        <Label>You already have an account?</Label>
        <Link href="/sign-in">
          <Label className="cursor-pointer underline">Sign In</Label>
        </Link>
      </CardFooter>
    </Card>
  );
}
