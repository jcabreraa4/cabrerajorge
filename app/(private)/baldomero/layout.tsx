import { ChatSidebar } from '@/components/chatbots/chat-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-row">
      {children}
      <ChatSidebar className="hidden xl:flex" />
    </div>
  );
}
