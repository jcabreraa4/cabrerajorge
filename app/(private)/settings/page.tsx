'use client';

import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';
import { FileAxis3DIcon, SearchIcon, UploadIcon } from 'lucide-react';
import { useParams } from '@/hooks/use-params';
import { VectorizeDialog } from '@/components/settings/vectorize-dialog';
import { EmbeddingsTable } from '@/components/settings/embeddings-table';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { CircleLoader } from '@/components/page-loaders';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { toast } from 'sonner';
import { processText } from '@/actions/generate-embeddings';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const [text, setText] = useState('');

  const embeddings = useQuery(api.embeddings.getAll, isLoaded ? {} : 'skip');
  const filteredEmbeddings = embeddings?.filter((embedding) => embedding.content.toLowerCase().includes(searchFilter.toLowerCase()));

  async function vectorizeText() {
    if (!text) {
      toast.error('There is no text to be processed.');
      return;
    }
    const toastLoader = toast.loading('Converting the text to AI embeddings...');
    const response = await processText(text);
    if (!response?.success) toast.error('There was an error converting the text.', { id: toastLoader });
    else {
      toast.success('Text converted to embeddings successfully.', { id: toastLoader });
      setText('');
    }
  }

  return (
    <main className="w-full flex flex-col xl:flex-row overflow-hidden">
      <section className="hidden xl:block w-full xl:max-w-120 xl:border-r xl:pr-4"></section>
      <section className="w-full flex flex-col gap-3 xl:gap-5 overflow-hidden xl:pl-4">
        <div className="flex flex-col lg:flex-row gap-3 xl:gap-5">
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
            className="min-w-50"
          />
        </div>
        <div className="hidden xl:flex flex-col lg:flex-row gap-5">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            id="text-embeddings"
            className="h-20"
          />
          <Button
            variant="secondary"
            className="w-full lg:w-fit lg:h-full cursor-pointer"
            onClick={vectorizeText}
          >
            <UploadIcon className="hidden lg:block" />
            <p className="lg:hidden">Process Text</p>
          </Button>
        </div>
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
        <div className="py-1 lg:hidden" />
      </section>
    </main>
  );
}
