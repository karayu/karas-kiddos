import { TabBar } from "../components/TabBar";

export default function EngagementPage() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background-light/80 py-4 backdrop-blur-sm dark:bg-background-dark/80">
        <div className="mx-auto flex items-center justify-between px-4">
          <button className="flex items-center justify-center rounded-full p-2 hover:bg-primary/10">
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300"> arrow_back </span>
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Statistics</h1>
          <div className="w-10" />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8 px-4">
            <a className="border-b-2 border-primary px-1 py-4 text-sm font-bold text-primary" href="#"> Categories </a>
            <a className="border-b-2 border-transparent px-1 py-4 text-sm font-bold text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300" href="#"> Top </a>
          </nav>
        </div>
        <div className="p-4">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">All Content</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">Your Views</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">123</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">Other Views</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">456</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Top Ranked</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-white p-2 dark:bg-gray-900">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQf8EGvMWx9-UpR-I48_yHYdzPqpZOgQ-yWvvdZgHPKTrFpxAo2jN9SavAbISPwHBbOH_oKCl7ix-IPbuOtfGY5mvVrhioXvN-QvLLx37X0pYuviR9g7q0W2nlIw4rUV8HAGgt0HV9IaRPhwG1-q6jNuNP2rem_HBo58LNRtmzydn58nLImBgcnAxIVJ47m9SJx2sj0lwGrUTQjI4AwHq8fcTGUyFFcX_D3vo2yQarlB7DLWEDg-Dt8X1P0H8s_du_Ro_xkP6tONnf')" }}
                  />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Sample {i}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Education</p>
                  </div>
                </div>
                <button className="flex items-center justify-center rounded-full p-2 hover:bg-primary/10">
                  <span className="material-symbols-outlined text-gray-700 dark:text-gray-300"> share </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <TabBar />
    </>
  );
}


