import CurrentRound from "./components/CurrentRound";
import Footer from "./components/Footer";
import PlayerList from "./components/PlayerList";
import WalletConnector from "./components/WalletConnector";
import Info from "./components/Info";
import AdminPanel from "./components/AdminPanel";
import History from "./components/History";

export default function() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="flex flex-row">
        <div className="grow">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-serif">Loethery</h1>
          <p className="text-2xl text-slate-700 dark:text-slate-300">An Ethereum-based lottery.</p>
        </div>
        <span className="grow-[2]"></span>
        <div className="grow text-right">
          <WalletConnector/>
        </div>
      </header>

      <div className="my-8 flex flex-col gap-4">
        <Info/>

        <div className="flex flex-col md:flex-row md:flex-nowrap gap-8">
          <CurrentRound/>
          <PlayerList/>
        </div>

        <AdminPanel/>
        <History/>
      </div>

      <Footer/>
    </main>
  );
}
