import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center justify-center h-16 w-16 bg-primary/20 rounded-lg">
            <span className="material-symbols-outlined text-4xl text-primary">auto_awesome</span>
          </div>
        </div>
        <div className="flex w-full max-w-sm grow bg-background-light dark:bg-background-dark @container p-4">
          <div className="w-full gap-1 overflow-hidden bg-background-light dark:bg-background-dark @[480px]:gap-2 aspect-[1/1] rounded-xl flex">
            <div 
              className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1" 
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1h0FCXznls0b1ySDLCMKDQ00MzQzltZmMl1rK9lZ9hePlEIczOE7y3HVcNEAdJ6xAGUtHfsO91V6h4DVJgpIdfXIv4-hvolyPzBGK8xLib_d8K4X_J8GpzMF3-3mggfYxgcA3Q7SMLpmPHkr0OnDMYYq_tQfhQgeFxcrsioRsHXt-C0ammKo6lt3KWEutYQMzwPOSaAb8NoN2QJ3E-G8oGEhtjId1Y7FsytozdvKIDLMb_ySDyiPEdC4cI5-Vw2z8OzbjNcB16MXf")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '1.5rem'
              }}
            />
          </div>
        </div>
        <h1 className="text-text-light dark:text-text-dark tracking-tight text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">
          Welcome to Kara's Kiddos
        </h1>
        <p className="text-text-light/80 dark:text-text-dark/80 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
          Less Chaos. More Magic.
        </p>
      </div>
      <div className="w-full px-4 pb-8 pt-4 sm:pb-12">
        <Link 
          href="/library" 
          className="flex min-w-[84px] max-w-md mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-full h-16 px-8 flex-1 bg-cta text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 hover:scale-105 active:scale-100 transition-all duration-200"
        >
          <span className="truncate">Get Started</span>
        </Link>
      </div>
    </div>
  );
}


