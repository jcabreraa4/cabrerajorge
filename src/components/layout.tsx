import type { FC, PropsWithChildren } from 'hono/jsx';

export const Layout: FC<PropsWithChildren<{ title?: string }>> = ({ title, children }) => (
  <html lang="es">
    <head>
      {/* Meta Tags */}
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      {/* Browser Tab */}
      <title>{title ?? 'Jorge Cabrera'}</title>
      <link
        rel="icon"
        type="image/webp"
        href="/logo.webp"
      />
      {/* CSS Styles */}
      <link
        rel="stylesheet"
        href="/styles.css"
      />
      {/* JS Scripts */}
      <script
        src="/htmx.min.js"
        defer
      ></script>
    </head>
    <body>{children}</body>
  </html>
);
