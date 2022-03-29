import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoetheryContext } from "./LoetheryContext";

export default function() {
  const [activeRound, setActiveRound] = useState();

  const loethery = useContext(LoetheryContext);
  useEffect(async () => {
    try {
      setActiveRound(await loethery.getActiveRound());
    } catch (err) {
      console.error(err);
      setActiveRound(null);
    }
  }, []);

  const entry = async () => {
    try {
      await loethery.buyEntry();
    } catch (err) {
      toast.error(err.error.message);
      console.error(err);
    }
  };

  return (
    <div className="card grow md:w-1/2 divide-y divide-solid dark:divide-slate-600">
      <h2 className="text-3xl px-4 py-2 font-bold dark:text-slate-50">Current Round</h2>
      { activeRound
      ? <div className="divide-y divide-dashed dark:divide-slate-600 flex flex-col">
          <div className="grow px-4 py-2 mb-2">
            <h3 className="text-2xl my-2 dark:text-slate-100"><q>{ activeRound.name }</q></h3>
            <p>Started at { new Date(activeRound.startDate).toLocaleString() }.</p>
          </div>

          <div className="grow px-4 py-2 mb-2">
            <h3 className="text-2xl my-2 dark:text-slate-100">Pot</h3>
            <p>{ activeRound.pot } ETH</p>
          </div>

          <div className="grow px-4 py-2">
            <h3 className="text-2xl my-2 dark:text-slate-100">Enter current round</h3>
            <p className="my-2">To enter the current round you have to pay { activeRound.price } ETH.</p>
            <button onClick={entry} className="rounded-full my-2 font-bold dark:bg-slate-700 bg-white px-4 py-2 text-lg ring-1 dark:ring-slate-500 ring-slate-300 shadow-lg dark:text-slate-100">Toss ETH into the pot</button>
          </div>
        </div>
      : <p className="px-4 py-2">No round currently active.</p>
      }
    </div>
  );
}