import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Paper } from '@/convex/schema';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExternalLinkIcon, FilePenIcon, FileTextIcon, MoreHorizontalIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { UpdateDialog } from './update-dialog';
import { RemoveDialog } from './remove-dialog';

export function PapersTable({ papers }: { papers: Paper[] }) {
  const router = useRouter();

  function openPaper(id: string) {
    router.push(`/dashboard/papers/${id}`);
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
        {papers.map((paper) => (
          <TableRow
            key={paper._id}
            className="h-12 cursor-pointer p-20"
          >
            <TableCell
              className="w-12.5 p-4"
              onClick={() => openPaper(paper._id)}
            >
              <FileTextIcon />
            </TableCell>
            <TableCell
              className="font-medium"
              onClick={() => openPaper(paper._id)}
            >
              <div className="w-35 max-w-120 md:w-fit truncate">{paper.title}</div>
            </TableCell>
            <TableCell
              className="text-muted-foreground hidden md:table-cell"
              onClick={() => openPaper(paper._id)}
            >
              {format(new Date(paper._creationTime), 'MMM dd, yyyy')}
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
                    id={paper._id}
                    title={paper.title}
                  >
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <FilePenIcon />
                      Rename Paper
                    </DropdownMenuItem>
                  </UpdateDialog>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => window.open(`/dashboard/papers/${paper._id}`, '_blank')}
                  >
                    <ExternalLinkIcon />
                    Open in a Tab
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <RemoveDialog id={paper._id}>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <TrashIcon />
                      Remove Paper
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
