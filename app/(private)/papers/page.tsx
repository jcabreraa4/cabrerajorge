'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { FileTextIcon, SearchIcon } from 'lucide-react';
import { useParams } from '@/hooks/use-params';
import { CreateButton } from '@/components/papers/create-button';
import { PapersTable } from '@/components/papers/papers-table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { CircleLoader } from '@/components/page-loaders';

export default function Page() {
  const [search, setSearch] = useParams('search');

  const papers = useQuery(api.papers.get);
  const filteredPapers = papers?.filter((paper) => paper.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="w-full flex flex-col gap-8">
      <section className="flex flex-col lg:flex-row gap-5">
        <InputGroup className="flex-1">
          <InputGroupInput
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={!papers}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <CreateButton
          variant="secondary"
          className="min-w-50"
        />
      </section>
      {!papers ? (
        <CircleLoader />
      ) : papers.length === 0 ? (
        <div className="flex-1 min-h-0 flex justify-center items-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon />
              </EmptyMedia>
              <EmptyTitle>No Papers Available</EmptyTitle>
              <EmptyDescription>You haven&apos;t created any papers yet. Get started by creating your first paper.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateButton className="min-w-50" />
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <section className="overflow-y-scroll pe-3">
          <PapersTable papers={filteredPapers || []} />
        </section>
      )}
    </main>
  );
}
