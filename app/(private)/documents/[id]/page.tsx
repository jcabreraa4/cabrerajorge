import { auth } from '@clerk/nextjs/server';
import { EditorMain } from '@/components/documents/editor-main';
import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });
  if (!token) throw new Error('Unauthorized');
  const preloadedDocument = await preloadQuery(api.documents.getById, { id }, { token });
  return <EditorMain preloadedDocument={preloadedDocument} />;
}
