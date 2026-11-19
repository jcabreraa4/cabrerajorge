import { Layout } from '@/components/layout';

function Page() {
  return (
    <Layout className="h-full p-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          class="border rounded-lg px-3 py-1 bg-black text-white cursor-pointer"
          hx-get="/api/time"
          hx-target="#output"
        >
          Server Time
        </button>
        <span id="output" />
      </div>
    </Layout>
  );
}

export const HomePage = Page();
