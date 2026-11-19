import type { FC, PropsWithChildren } from 'hono/jsx';

interface LayoutProps {
  title?: string;
  className?: string;
}

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({ children, title, className }) => (
  <html
    lang="es"
    data-theme="light"
  >
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
    <body className={className}>{children}</body>
  </html>
);
