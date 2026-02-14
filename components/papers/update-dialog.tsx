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
  id: Id<'papers'>;
  title: string;
  children: React.ReactNode;
}

export function UpdateDialog({ id, title, children }: UpdateDialogProps) {
  const [input, setInput] = useState(title);

  const updatePaper = useMutation(api.papers.updateById);

  function renamePaper() {
    updatePaper({ id, title: input }).finally(() => {
      toast.success('Paper renamed successfully.');
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Paper</DialogTitle>
          <DialogDescription>Enter a new name for the paper.</DialogDescription>
        </DialogHeader>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="w-full cursor-pointer"
              onClick={renamePaper}
            >
              <SaveIcon />
              Rename Paper
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
