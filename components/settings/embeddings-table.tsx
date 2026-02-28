import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CopyIcon, PenIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Embedding } from '@/convex/schema';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function EmbeddingsTable({ embeddings }: { embeddings: Embedding[] }) {
  function copyVector(vector: string) {
    navigator.clipboard.writeText(vector);
    toast.success('Vector copied to clipboard successfully.');
  }

  const deleteEmbeddings = useMutation(api.embeddings.deleteAll);
  const deleteEmbedding = useMutation(api.embeddings.deleteById);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Number</TableHead>
          <TableHead>Content</TableHead>
          <TableHead className="text-right">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="cursor-pointer hover:bg-inherit dark:hover:bg-inherit"
                >
                  <TrashIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Embeddings</DialogTitle>
                  <DialogDescription>Reset the memory of your AI bot.</DialogDescription>
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {embeddings.map((embedding, index) => (
          <TableRow
            key={embedding._id}
            className="overflow-x-scroll max-w-120"
          >
            <TableCell className="font-medium">Emb {index + 1}</TableCell>
            <TableCell className="truncate max-w-100">{embedding.content}</TableCell>
            <TableCell className="text-right">
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
                        onClick={() => copyVector(embedding.vector.toString())}
                      >
                        <CopyIcon />
                        Copy <span className="hidden xl:block">Embedding</span>
                      </Button>
                    </DialogClose>
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
                        Delete <span className="hidden xl:block">Embedding</span>
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
