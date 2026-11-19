import type { FC, PropsWithChildren } from 'hono/jsx';

export const Layout: FC<PropsWithChildren<{ title?: string }>> = ({ title, children }) => (
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>{title ?? 'Jorge Cabrera'}</title>
      <link
        rel="stylesheet"
        href="/styles.css"
      />
    </head>
    <body>{children}</body>
  </html>
);
