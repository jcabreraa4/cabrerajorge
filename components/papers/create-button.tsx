'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

interface CreateButtonProps {
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

export function CreateButton({ variant, className, disabled }: CreateButtonProps) {
  const router = useRouter();

  const createPaper = useMutation(api.papers.create);

  function handleCreate() {
    createPaper({ title: 'Untitled Paper', content: '' }).then((paperId) => {
      router.push(`/dashboard/papers/${paperId}`);
    });
  }

  return (
    <Button
      variant={variant}
      className={cn('cursor-pointer', className)}
      onClick={handleCreate}
      disabled={disabled}
    >
      <PlusIcon />
      Create Paper
    </Button>
  );
}
