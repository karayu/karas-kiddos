export const metadata = {
  title: "Kara's Kiddos",
  description: "Less Chaos. More Magic.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Epilogue:wght@400;500;700;900"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind.config = { darkMode: 'class', theme: { extend: { colors: { primary: '#13a4ec', 'background-light': '#f6f7f8', 'background-dark': '#101c22', }, fontFamily: { display: ['Epilogue'] }, borderRadius: { DEFAULT: '0.5rem', lg: '1rem', xl: '1.5rem', full: '9999px' } } } }`,
          }}
        />
        <style>{`body { min-height: max(884px, 100dvh); }`}</style>
      </head>
      <body className="bg-background-light dark:bg-background-dark font-display text-[#101c22] dark:text-background-light">
        <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden">
          <div className="flex-1 w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}


