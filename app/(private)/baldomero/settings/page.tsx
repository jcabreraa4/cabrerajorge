'use client';

import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';
import { FileAxis3DIcon, SaveIcon, SearchIcon } from 'lucide-react';
import { useParams } from '@/hooks/use-params';
import { VectorizeDialog } from '@/components/settings/vectorize-dialog';
import { EmbeddingsTable } from '@/components/settings/embeddings-table';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { CircleLoader } from '@/components/page-loaders';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const [context, setContext] = useState('');

  const embeddings = useQuery(api.embeddings.getAll, isLoaded ? {} : 'skip');
  const filteredEmbeddings = embeddings?.filter((embedding) => embedding.content.toLowerCase().includes(searchFilter.toLowerCase()));

  const information = useQuery(api.information.getOne, isLoaded ? {} : 'skip');
  const updateContext = useMutation(api.information.upsertOne);

  useEffect(() => {
    if (information?.context) setContext(information.context);
  }, [information]);

  return (
    <main className="p-3 xl:p-4 w-full flex flex-col gap-3 xl:gap-5 overflow-hidden">
      <section className="flex flex-col lg:flex-row gap-3 xl:gap-5">
        <InputGroup>
          <InputGroupInput
            disabled={!embeddings || embeddings.length === 0}
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <VectorizeDialog
          variant="outline"
          className="min-w-50 hidden lg:flex"
        />
      </section>
      <section className="flex flex-row gap-3 lg:gap-5">
        <Textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          id="text-embeddings"
          className="h-22 lg:h-20"
        />
        <Button
          variant="secondary"
          className="w-fit h-22 lg:h-20 cursor-pointer"
          onClick={() =>
            updateContext({ context: context }).finally(() => {
              toast.success('Context updated successfully.');
            })
          }
        >
          <SaveIcon />
        </Button>
      </section>
      <VectorizeDialog
        variant="outline"
        className="w-full lg:hidden"
      />
      {!embeddings ? (
        <CircleLoader />
      ) : embeddings.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileAxis3DIcon className="size-6" />
            </EmptyMedia>
            <EmptyTitle className="text-xl">No Embeddings Available</EmptyTitle>
            <EmptyDescription className="text-md">You haven&apos;t processed any files yet. Get started by processing your first file.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <VectorizeDialog className="min-w-50" />
          </EmptyContent>
        </Empty>
      ) : (
        <EmbeddingsTable embeddings={filteredEmbeddings || []} />
      )}
    </main>
  );
}
