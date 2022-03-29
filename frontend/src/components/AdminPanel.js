import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { LoetheryContext } from "./LoetheryContext";

export default function() {
  const loethery = useContext(LoetheryContext);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [activeRound, setActiveRound] = useState();
  const [balance, setBalance] = useState(0);

  useEffect(async () => {
    try {
      setBalance(await loethery.getBalance());
      setActiveRound(await loethery.getActiveRound());
    } catch (err) {
      console.error(err);
      setActiveRound(null);
    }
  }, []);

  const submit = (event) => {
    event.preventDefault();

    loethery.startLottery(name, price);
  };

  const finishLottery = async () => {
    try {
      await loethery.finishLottery();
    } catch (err) {
      console.error(err);
      toast.error(err.error.message);
    }
  }

  const withdraw = async () => {
    try {
      await loethery.withdraw();
    } catch (err) {
      console.error(err);
      toast.error(err.error.message);
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
                <dd className="ml-4 my-1">{new Date(activeRound.startDate).toLocaleString()}</dd>
                <dt className="my-1">Entry fee:</dt>
                <dd className="ml-4 my-1">{activeRound.price} ETH</dd>
              </dl>
              <button onClick={finishLottery} className="button dark:text-slate-50 my-2">End round</button>
            </div>
          : <div>
              <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="self-start flex flex-col gap-2">
                  <label>Name</label>
                  <input type="text" className="px-2 py-1 dark:bg-slate-700 ring-1 dark:ring-slate-500 rounded dark:text-slate-50" onChange={(event) => setName(event.target.value)}></input>
                </div>

                <div className="self-start flex flex-col gap-2">
                  <label>Entry fee</label>
                  <input type="number" step="0.000000001" min="0" className="px-2 py-1 dark:bg-slate-700 ring-1 dark:ring-slate-500 rounded dark:text-slate-50" onChange={(event) => setPrice(event.target.value)} ></input>
                </div>

                <input type="submit" value="Start New Round" className="my-2 self-start button dark:text-slate-50"></input>
              </form>
            </div>
          }
        </div>

        <div className="px-4 py-2 md:w-1/2">
          <h3 className="text-2xl my-2 dark:text-slate-100">Lottery balance</h3>
          <div>
            <p className="my-2">{ balance } ETH</p>
            <button onClick={withdraw} className="button dark:text-slate-50 my-2">Withdraw funds</button>
          </div>
        </div>
      </div>
    </div>
  );
}