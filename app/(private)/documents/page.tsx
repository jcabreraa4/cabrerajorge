'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { FileTextIcon, SearchIcon } from 'lucide-react';
import { useParams } from '@/hooks/use-params';
import { CreateButton } from '@/components/documents/create-button';
import { DocumentsTable } from '@/components/documents/documents-table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { CircleLoader } from '@/components/page-loaders';
import { useAuth } from '@clerk/nextjs';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const documents = useQuery(api.documents.getAll, isLoaded ? {} : 'skip');
  const filteredDocuments = documents?.filter((document) => document.title.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <main className="flex-1 min-h-0 w-full flex flex-col gap-8 overflow-hidden">
      <section className="flex flex-col lg:flex-row gap-5">
        <InputGroup className="flex-1">
          <InputGroupInput
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            disabled={!documents || documents.length === 0}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <CreateButton
          variant="outline"
          className="min-w-50"
        />
      </section>
      {!documents ? (
        <CircleLoader />
      ) : documents.length === 0 ? (
        <section className="flex-1 min-h-0 flex justify-center items-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Documents Available</EmptyTitle>
              <EmptyDescription className="text-md">You haven&apos;t created any documents yet. Get started by creating your first document.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateButton className="min-w-50" />
            </EmptyContent>
          </Empty>
        </section>
      ) : (
        <section className="h-0 flex-1 overflow-y-scroll pe-3">
          <DocumentsTable documents={filteredDocuments || []} />
        </section>
      )}
    </main>
  );
}
