import { Particles } from '@/components/ui/particles';

export default function NotFound() {
  return (
    <main className="h-screen flex flex-col gap-5 justify-center items-center">
      <section className="w-full h-20 flex justify-center gap-5">
        <div className="h-full flex items-center border-e-2 pe-5">
          <p className="text-3xl font-semibold">404</p>
        </div>
        <div className="h-full flex flex-col justify-center gap-2">
          <p className="text-2xl font-semibold">Page not found</p>
          <p className="text-2xl font-semibold">Página no encontrada</p>
        </div>
      </section>
      <Particles
        className="fixed inset-0 z-[-1]"
        quantity={150}
        ease={80}
        refresh
      />
    </main>
  );
}
