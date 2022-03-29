import { useContext } from "react";
import toast from "react-hot-toast";
import handleError from "../utils/ErrorHandler";
import { LoetheryContext } from "./LoetheryContext";
import Spinner from "./Spinner";

export default function(props) {
  const loethery = useContext(LoetheryContext);
  const activeRound = props.activeRound;
  const isLoading = props.isLoading;
  const setIsLoading = props.setIsLoading;

  const entry = async () => {
    try {
      setIsLoading(true);

      const txn = await loethery.buyEntry();
      await txn.wait();

      setIsLoading(false);

      props.onChange();
    } catch (err) {
      handleError(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="card grow md:w-1/2 divide-y divide-solid dark:divide-slate-600">
      <h2 className="text-3xl px-4 py-2 font-bold dark:text-slate-50">Current Round</h2>
      { activeRound
      ? <div className="divide-y divide-dashed dark:divide-slate-600 flex flex-col">
          <div className="grow px-4 py-2 mb-2">
            <h3 className="text-2xl my-2 dark:text-slate-100"><q>{ activeRound.name }</q></h3>
            <p>Started at { activeRound.startDate.toLocaleString() }.</p>
          </div>

          <div className="grow px-4 py-2 mb-2">
            <h3 className="text-2xl my-2 dark:text-slate-100">Pot</h3>
            <p>{ activeRound.pot } ETH</p>
          </div>

          <div className="grow px-4 py-2">
            <h3 className="text-2xl my-2 dark:text-slate-100">Enter current round</h3>
            <p className="my-2">To enter the current round you have to pay { activeRound.price } ETH.</p>
            <button onClick={entry} disabled={isLoading} className="inline-flex items-center rounded-full my-2 font-bold dark:bg-slate-700 bg-white px-4 py-2 text-lg ring-1 dark:ring-slate-500 ring-slate-300 shadow-lg dark:text-slate-100">
              { isLoading && <Spinner/> }
              Toss ETH into the pot
            </button>
          </div>
        </div>
      : <p className="px-4 py-2">No round currently active.</p>
      }
    </div>
  );
}