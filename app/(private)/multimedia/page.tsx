'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { ImageIcon, SearchIcon } from 'lucide-react';
import { MediaTable } from '@/components/multimedia/media-table';
import { UploadDialog } from '@/components/multimedia/upload-dialog';
import { CircleLoader } from '@/components/page-loaders';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/convex/_generated/api';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { isLoaded } = useAuth();

  const [typeFilter, setTypeFilter] = useParams('type');
  const [searchFilter, setSearchFilter] = useParams('search');
  const effectiveTypeFilter = typeFilter || 'all';

  const multimedia = useQuery(api.multimedia.getAll, isLoaded ? {} : 'skip');
  const filteredFiles = multimedia?.filter((file) => searchFilter === '' || file.name.toLowerCase().includes(searchFilter.toLowerCase())).filter((file) => (effectiveTypeFilter === 'all' ? true : file.type.includes(effectiveTypeFilter)));

  return (
    <main className="flex-1 min-h-0 w-full flex flex-col gap-8">
      <section className="flex flex-col lg:flex-row gap-5">
        <Select
          value={effectiveTypeFilter}
          onValueChange={(value) => setTypeFilter(value === 'all' ? '' : value)}
        >
          <SelectTrigger
            className="hidden xl:flex min-w-50 cursor-pointer"
            disabled={!multimedia || multimedia.length === 0}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audios</SelectItem>
              <SelectItem value="pdf">Others</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            disabled={!multimedia || multimedia.length === 0}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <UploadDialog
          variant="outline"
          className="min-w-50"
        />
      </section>
      {!multimedia ? (
        <CircleLoader />
      ) : multimedia.length === 0 ? (
        <section className="flex-1 min-h-0 flex justify-center items-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Multimedia Available</EmptyTitle>
              <EmptyDescription className="text-md">You haven&apos;t uploaded any files yet. Get started by uploading your first file.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <UploadDialog className="min-w-50" />
            </EmptyContent>
          </Empty>
        </section>
      ) : (
        <section className="flex-1 min-h-0 flex flex-col gap-8 overflow-y-scroll lg:pe-3 xl:pe-5">
          <MediaTable multimedia={filteredFiles || []} />
        </section>
      )}
    </main>
  );
}
