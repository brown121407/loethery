import { ethers } from 'ethers';
import  contract  from '../contracts/Loethery.json';
const contractAddress = "0x989A5ceDbAD8382Ac9a81198dF2151e6EbFaE2c7";
const price = 0.01;

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const connectedContract = new ethers.Contract(contractAddress, contract.abi, signer);


export const connectWallet = async () => {

    let chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
        const obj = {
            status: "You are not connected to the Rinkeby Test Network!",
            address: "",
        };
        return obj; 
    } else 
    
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };


export const getCurrentWalletConnected = async () => {
    let chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
        const obj = {
            status: "You are not connected to the Rinkeby Test Network!",
            address: "",
        };
        return obj; 
    } else 
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "",
          };
        } else {
          return {
            address: "",
            status: "",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };


export const entry = async() => {
    if(window.ethereum){
      let txn = await connectedContract.buyEntry({value: ethers.utils.parseEther(price.toString())});
      getPot();
      return txn;
    }
         
  }

// export const setName = async(name) => {
//   if(window.ethereum){
//     let txn = await connectedContract.nameSet(name);
//     return txn;
//   }
// }

// export const setPrice = async(price) => {
//   if(window.ethereum){
//     let txn = await connectedContract.priceSet(price);
//     return txn;
//   }
// }

export const finishLottery = async() => {
  if(window.ethereum) {
    let txn = await connectedContract.finishLottery();
    return txn;
  }
}


export const getPot = async() => {
    if(window.ethereum){

        let txn = await connectedContract.getPotTotal();
        console.log(txn);
        return txn;
        
    }
  }


export const startLottery = async (cost, name) => {
    if(window.ethereum){

        let date = (new Date()).getTime();
        let dateUnixTimestamp = date / 1000;

        let txn = await connectedContract.startLottery(cost, name, dateUnixTimestamp);
        return txn;
    }
   
  }



