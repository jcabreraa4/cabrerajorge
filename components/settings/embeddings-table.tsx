import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PenIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Embedding } from '@/convex/schema';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function EmbeddingsTable({ embeddings }: { embeddings: Embedding[] }) {
  const deleteEmbeddings = useMutation(api.embeddings.deleteAll);
  const deleteEmbedding = useMutation(api.embeddings.deleteById);

  return (
    <Table className="overflow-hidden">
      <TableHeader>
        <TableRow className="hover:bg-inherit h-12">
          <TableHead>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                >
                  <TrashIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Embeddings</DialogTitle>
                  <DialogDescription>Reset the memory of your AI assistant.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      className="w-full cursor-pointer"
                      onClick={() =>
                        deleteEmbeddings().finally(() => {
                          toast.success('Embeddings deleted successfully.');
                        })
                      }
                    >
                      <TrashIcon />
                      Delete Embeddings
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TableHead>
          <TableHead className="px-4">Number</TableHead>
          <TableHead>Content</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-x-scroll overflow-y-scroll">
        {embeddings.map((embedding, index) => (
          <TableRow
            key={embedding._id}
            className="overflow-hidden max-w-120"
          >
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="cursor-pointer hover:bg-inherit dark:hover:bg-inherit"
                  >
                    <PenIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Embedding {index + 1}</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  {embedding.content}
                  <DialogFooter className="flex-row">
                    <DialogClose asChild>
                      <Button
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          deleteEmbedding({ id: embedding._id }).finally(() => {
                            toast.success('Embedding deleted successfully.');
                          })
                        }
                      >
                        <TrashIcon />
                        Delete Embedding
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
            <TableCell className="font-medium px-4">Emb {index + 1}</TableCell>
            <TableCell className="truncate">{embedding.content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
