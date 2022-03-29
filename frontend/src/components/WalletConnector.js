import { useContext, useEffect, useState } from "react";
import { LoetheryContext } from "./LoetheryContext";

export default function(props) {
  const loethery = useContext(LoetheryContext);

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  
  useEffect(async () => {
    const { address, _ } = await loethery.getWallet();

    setWallet(address);

    props.onChange();

    await addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log('event fired');
        if (accounts.length > 0) {
          let chainId = window.ethereum.request({ method: 'eth_chainId' });
          
          // String, hex code of the chainId of the Rinkeby test network
          const rinkebyChainId = "0x4"; 
          if (chainId !== rinkebyChainId) {
            setStatus("You are not connected to the Rinkeby Test Network!");
            setWallet("");
          } else {
            setWallet(accounts[0]);
            setStatus("");
          }
        } else {
          setWallet("");
          setStatus("");
        }

        props.onChange();
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await loethery.connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  return (
    <div>
      <button onClick={connectWalletPressed} className="rounded-full font-bold dark:bg-slate-700 bg-white px-4 py-2 text-lg ring-1 dark:ring-slate-500 ring-slate-300 shadow-lg">
      { walletAddress ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
        </button>

        <p>{status}</p>
    </div>
  );
}