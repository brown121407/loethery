import Footer from "./components/Footer";
import PlayerList from "./components/PlayerList";
import WalletConnector from "./components/WalletConnector";
import Info from "./components/Info";
import AdminPanel from "./components/AdminPanel";
import History from "./components/History";
import { LoetheryContext } from "./components/LoetheryContext";
import Loethery from "./Loethery";
import ActiveRound from "./components/ActiveRound";
import { useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';

export default function() {
  const loethery = new Loethery();

  const [isOwner, setIsOwner] = useState(false);
  const [activeRound, setActiveRound] = useState();
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    await refreshOwnerStatus();
    await updateLotteryState();
  }, []);

  useEffect(async () => {
    if (isOwner) {
      setBalance(await loethery.getBalance());
    }
  }, [isOwner])

  const refreshOwnerStatus = async () => {
    setIsOwner(await loethery.isOwner());
  }

  const updateLotteryState = async () => {
    setIsLoading(true);
    try {
      setActiveRound(await loethery.getActiveRound());
    } catch (err) {
      console.error(err);
      setActiveRound(null);
    }

    setPlayers(await loethery.getPlayers());
    setHistory(await loethery.getHistory());

    if (isOwner) {
      setBalance(await loethery.getBalance());
    }

    setIsLoading(false);
  }

  return (
    <LoetheryContext.Provider value={loethery}>
      <main className="container mx-auto px-4 py-8">
        <header className="flex flex-row">
          <div className="grow">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-serif">Loethery</h1>
            <p className="text-2xl text-slate-700 dark:text-slate-300">An Ethereum-based lottery.</p>
          </div>
          <span className="grow-[2]"></span>
          <div className="grow text-right">
            <WalletConnector onChange={refreshOwnerStatus}/>
          </div>
        </header>

        <div className="my-8 flex flex-col gap-4">
          <Info/>

          { loethery.hasWalledConnected()
          ? <div>
              <div className="flex flex-col md:flex-row md:flex-nowrap gap-8">
                <ActiveRound isLoading={isLoading} setIsLoading={setIsLoading} activeRound={activeRound} onChange={updateLotteryState} />
                <PlayerList players={players}/>
              </div>

              { isOwner && <AdminPanel isLoading={isLoading} setIsLoading={setIsLoading} activeRound={activeRound} balance={balance} onChange={updateLotteryState} /> }
              <History history={history} />
            </div>
          :  <p className="my-8 font-bold text-xl">Please connect your wallet.</p>
          }
        </div>

        <Footer/>
      </main>
      <Toaster/>
    </LoetheryContext.Provider>
  );
}
