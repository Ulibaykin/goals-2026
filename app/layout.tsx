export const metadata = {
  title: 'Goals 2026',
  description: 'Личный трекер целей на 2026 год',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
