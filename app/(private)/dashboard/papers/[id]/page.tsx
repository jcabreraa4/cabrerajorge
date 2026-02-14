import { auth } from '@clerk/nextjs/server';
import { EditorMain } from '@/components/papers/editor-main';
import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

interface PaperPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });
  if (!token) throw new Error('Unauthorized');
  const preloadedPaper = await preloadQuery(api.papers.getById, { id }, { token });
  return <EditorMain preloadedPaper={preloadedPaper} />;
}
