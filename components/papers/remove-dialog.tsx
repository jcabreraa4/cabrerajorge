import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteDialogProps {
  id: Id<'papers'>;
  redirect?: boolean;
  children: React.ReactNode;
}

export function RemoveDialog({ id, redirect = false, children }: DeleteDialogProps) {
  const router = useRouter();
  const deletePaper = useMutation(api.papers.deleteById);

  function removePaper() {
    deletePaper({ id }).finally(() => {
      redirect && router.push('/dashboard/papers');
      toast.success('Paper removed successfully.');
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Paper</DialogTitle>
          <DialogDescription>Remove this paper from your account.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={removePaper}
            >
              <TrashIcon />
              Remove Paper
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
