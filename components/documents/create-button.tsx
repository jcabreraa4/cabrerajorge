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

  const createDocument = useMutation(api.documents.create);

  function handleCreate() {
    createDocument({}).then((documentId) => {
      router.push(`/documents/${documentId}`);
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
      Create Document
    </Button>
  );
}
