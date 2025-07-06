import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
function App() {
  return (
    <>
      <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <main>
          <HeroSection />
        </main>
      </div>
    </>
  );
}

export default App;
