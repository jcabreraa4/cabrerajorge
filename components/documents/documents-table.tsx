import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Document } from '@/convex/schema';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExternalLinkIcon, FilePenIcon, FileTextIcon, MoreHorizontalIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { UpdateDialog } from './update-dialog';
import { RemoveDialog } from './remove-dialog';

export function DocumentsTable({ documents }: { documents: Document[] }) {
  const router = useRouter();

  function openDocument(id: string) {
    router.push(`/documents/${id}`);
  }

  function openWindow(id: string) {
    window.open(`/documents/${id}`, '_blank');
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-none">
          <TableHead>Name</TableHead>
          <TableHead>&nbsp;</TableHead>
          <TableHead className="hidden md:table-cell">Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) => (
          <TableRow
            key={document._id}
            className="h-12 cursor-pointer p-20"
          >
            <TableCell
              className="w-12.5 p-4"
              onClick={() => openDocument(document._id)}
            >
              <FileTextIcon />
            </TableCell>
            <TableCell
              className="font-medium"
              onClick={() => openDocument(document._id)}
            >
              <div className="w-35 max-w-120 md:w-fit truncate">{document.title}</div>
            </TableCell>
            <TableCell
              className="text-muted-foreground hidden md:table-cell"
              onClick={() => openDocument(document._id)}
            >
              {format(new Date(document._creationTime), 'MMM dd, yyyy')}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 cursor-pointer"
                  >
                    <MoreHorizontalIcon />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <UpdateDialog
                    id={document._id}
                    title={document.title}
                  >
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <FilePenIcon />
                      Rename Document
                    </DropdownMenuItem>
                  </UpdateDialog>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openWindow(document._id)}
                  >
                    <ExternalLinkIcon />
                    Open in a new Tab
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <RemoveDialog id={document._id}>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <TrashIcon />
                      Remove Document
                    </DropdownMenuItem>
                  </RemoveDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
