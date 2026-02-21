import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteDialogProps {
  id: Id<'documents'>;
  redirect?: boolean;
  children: React.ReactNode;
}

export function RemoveDialog({ id, redirect = false, children }: DeleteDialogProps) {
  const router = useRouter();
  const deleteDocument = useMutation(api.documents.deleteById);

  function removeDocument() {
    deleteDocument({ id }).finally(() => {
      redirect && router.push('/documents');
      toast.success('Document removed successfully.');
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Document</DialogTitle>
          <DialogDescription>Remove document from your account.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={removeDocument}
            >
              <TrashIcon />
              Remove Document
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
