import { ChatSidebar } from '@/components/chatbots/chat-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full overflow-hidden flex">
      {children}
      <ChatSidebar />
    </main>
  );
}
