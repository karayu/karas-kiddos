import { TabBar } from "../components/TabBar";

export default function ProfilePage() {
  return (
    <>
      <div className="flex-grow">
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
          <div className="flex items-center p-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="flex-1 text-center text-lg font-bold tracking-tight text-slate-900 dark:text-white pr-10">Account</h1>
          </div>
        </header>
        <main className="p-4">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://img.freepik.com/premium-photo/vibrant-d-cartoon-headshot-average-woman-professional-attire_1283595-12286.jpg")' }} />
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">Sophia Carter</p>
              <p className="text-base text-slate-500 dark:text-slate-400">Parent</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="px-4 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Family</h2>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-lg bg-white dark:bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 dark:text-slate-200">Number of people</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">2 people</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Age</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Child: 3 years old</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Interests</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Animals, Music, Books</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="px-4 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subscription</h2>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-lg bg-white dark:bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Purchase history</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">12/12/2024</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Trial status</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">14 days left</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Credit card</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Visa ending in 4242</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="px-4 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Address</h2>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-lg bg-white dark:bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Home address</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">123 Maple Street, Anytown, USA</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <TabBar />
    </>
  );
}


