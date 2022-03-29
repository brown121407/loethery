import { useContext, useState } from "react";
import handleError from "../utils/ErrorHandler";
import { LoetheryContext } from "./LoetheryContext";
import Spinner from "./Spinner";

export default function(props) {
  const loethery = useContext(LoetheryContext);
  const activeRound = props.activeRound;
  const balance = props.balance;
  const isLoading = props.isLoading;
  const setIsLoading = props.setIsLoading;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const startLottery = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      const txn = await loethery.startLottery(name, price);
      await txn.wait();

      setIsLoading(false);

      props.onChange();
    } catch(err) {
      handleError(err);

      setIsLoading(false);
    }
  };

  const finishLottery = async () => {
    try {
      setIsLoading(true);

      const txn = await loethery.finishLottery();
      await txn.wait();

      setIsLoading(false);

      props.onChange();
    } catch (err) {
      handleError(err);

      setIsLoading(false);
    }
  }

  const withdraw = async () => {
    try {
      setIsLoading(true);

      const txn = await loethery.withdraw();
      await txn.wait();

      setIsLoading(false);

      props.onChange();
    } catch (err) {
      handleError(err);

      setIsLoading(false);
    }
  }

  return (
    <div className="card shadow-lg shadow-red-500 ring-red-500 divide-y divide-solid dark:divide-slate-600">
      <h2 className="text-3xl font-bold px-4 py-2 dark:text-red-500 text-red-600">Admin Panel</h2>
      <div className="flex flex-col md:flex-row flex-wrap divide-y md:divide-y-0 md:divide-x divide-dashed dark:divide-slate-600">
        <div className="px-4 py-2 md:w-1/2">
          <h3 className="text-2xl my-2 dark:text-slate-100">Round Settings</h3>
          { activeRound 
          ? <div>
              <dl>
                <dt className="my-1">Name:</dt>
                <dd className="ml-4 my-1">{activeRound.name}</dd>
                <dt className="my-1">Started at:</dt>
                <dd className="ml-4 my-1">{ activeRound.startDate.toLocaleString() }</dd>
                <dt className="my-1">Entry fee:</dt>
                <dd className="ml-4 my-1">{activeRound.price} ETH</dd>
              </dl>
              <button onClick={finishLottery} disabled={isLoading} className="inline-flex items-center button dark:text-slate-50 my-2">
                { isLoading && <Spinner/> }
                End round
              </button>
            </div>
          : <div>
              <form className="flex flex-col gap-4" onSubmit={startLottery}>
                <div className="self-start flex flex-col gap-2">
                  <label>Name</label>
                  <input type="text" className="px-2 py-1 dark:bg-slate-700 ring-1 dark:ring-slate-500 rounded dark:text-slate-50" onChange={(event) => setName(event.target.value)}></input>
                </div>

                <div className="self-start flex flex-col gap-2">
                  <label>Entry fee</label>
                  <input type="number" step="0.000000001" min="0" className="px-2 py-1 dark:bg-slate-700 ring-1 dark:ring-slate-500 rounded dark:text-slate-50" onChange={(event) => setPrice(event.target.value)} ></input>
                </div>

                <button type="submit" disabled={isLoading} className="inline-flex items-center my-2 self-start button dark:text-slate-50">
                  { isLoading && <Spinner/> }
                  Start New Round
                </button>
              </form>
            </div>
          }
        </div>

        <div className="px-4 py-2 md:w-1/2">
          <h3 className="text-2xl my-2 dark:text-slate-100">Lottery balance</h3>
          <div>
            <p className="my-2">{ balance } ETH</p>
            <button onClick={withdraw} disabled={isLoading} className="inline-flex items-center button dark:text-slate-50 my-2">
              { isLoading && <Spinner/> }
              Withdraw funds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}