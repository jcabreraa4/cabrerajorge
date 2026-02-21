import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

interface UpdateDialogProps {
  id: Id<'documents'>;
  title: string;
  children: React.ReactNode;
}

export function UpdateDialog({ id, title, children }: UpdateDialogProps) {
  const [input, setInput] = useState(title);

  const updateDocument = useMutation(api.documents.updateById);

  function renameDocument() {
    updateDocument({ id, title: input }).finally(() => {
      toast.success('Document renamed successfully.');
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Document</DialogTitle>
          <DialogDescription>Rename the selected document.</DialogDescription>
        </DialogHeader>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="w-full cursor-pointer"
              onClick={renameDocument}
            >
              <SaveIcon />
              Rename Document
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
