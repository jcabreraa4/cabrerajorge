import { Layout } from '@/components/layout';

function Page() {
  return (
    <Layout>
      <h1 className="font-black text-red-500">Home Page</h1>
      <button
        type="button"
        class="btn btn-primary"
        hx-get="/api/time"
        hx-target="#output"
      >
        Hora del servidor
      </button>
      <span id="output" />
    </Layout>
  );
}

export const HomePage = Page();
