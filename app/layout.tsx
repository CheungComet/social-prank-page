import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '社交整蛊 - 你要转一万刀吗？',
  description: '一个有趣的社交整蛊页面',
}

export const viewport: Viewport = {
  themeColor: '#2d1854',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased overflow-hidden" style={{ fontFamily: '"Press Start 2P", monospace' }}>
        {children}
      </body>
    </html>
  )
}
