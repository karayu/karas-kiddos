export const metadata = {
  title: "Welcome Screen",
  description: "Less Chaos. More Magic.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind.config = { darkMode: 'class', theme: { extend: { colors: { primary: '#8c2bee', 'background-light': '#f7f6f8', 'background-dark': '#191022', 'text-light': '#141118', 'text-dark': '#f7f6f8', cta: '#8c2bee' }, fontFamily: { display: ['Plus Jakarta Sans', 'Noto Sans', 'sans-serif'] }, borderRadius: { DEFAULT: '1rem', lg: '2rem', xl: '3rem', full: '9999px' } } } }`,
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `.material-symbols-outlined{font-variation-settings:FILL 0,wght 400,GRAD 0,opsz 24}body{min-height:max(884px,100dvh)}`
        }} />
      </head>
      <body className="font-display">
        <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden">
          <div className="flex-1 w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}


