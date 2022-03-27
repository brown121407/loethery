import { entry } from "../util/interact";
import { getPot } from "../util/interact";

export default function() {
  
  const currentRound = {
    name: "Round Title Here",
    startedAt: new Date(),
    entryFee: 0.001,
    pot: 123,
  };
  // const currentRound = null;

  return (
    <div className="card grow md:w-1/2 divide-y divide-solid dark:divide-slate-600">
      <h2 className="text-3xl px-4 py-2 font-bold dark:text-slate-50">Current Round</h2>
      { currentRound
      ? <div className="divide-y divide-dashed dark:divide-slate-600 flex flex-col">
          <div className="grow px-4 py-2 mb-2">
            <h3 className="text-2xl my-2 dark:text-slate-100"><q>{ currentRound.name }</q></h3>
            <p>Started at { currentRound.startedAt.toLocaleString() }.</p>
          </div>

          <div className="grow px-4 py-2 mb-2">
            <h3 className="text-2xl my-2 dark:text-slate-100">Pot</h3>
            <p>{ currentRound.pot } ETH</p>
          </div>

          <div className="grow px-4 py-2">
            <h3 className="text-2xl my-2 dark:text-slate-100">Enter current round</h3>
            <p className="my-2">To enter the current round you have to pay { currentRound.entryFee } ETH.</p>
            <button onClick={entry} className="rounded-full my-2 font-bold dark:bg-slate-700 bg-white px-4 py-2 text-lg ring-1 dark:ring-slate-500 ring-slate-300 shadow-lg dark:text-slate-100">Toss ETH into the pot</button>
          </div>
        </div>
      : <p className="px-4 py-2">No round currently active.</p>
      }
    </div>
  );
}