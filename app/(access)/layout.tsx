import { RectangleThemeButton } from '@/components/next-theme';

export default function AccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen flex justify-center items-center px-5 lg:px-0 bg-[#080808]">
      <div className="fixed top-0 left-0 p-5 z-50">
        <RectangleThemeButton />
      </div>
      {children}
    </main>
  );
}
