import { usePathname } from 'next/navigation';

export function useLocation() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  return { segments };
}
