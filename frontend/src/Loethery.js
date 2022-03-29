import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import contract from './contracts/Loethery.json';

export default class Loethery {
  constructor() {
    const contractAddress = "0x7418540481Cb0829FaF1F2d03A1FA18776ACD2fe";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    this.contract = new ethers.Contract(contractAddress, contract.abi, signer);
  }

  async connectWallet() {
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
    } else if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const obj = {
          status: "",
          address: addressArray[0],
        };

        this.wallet = obj.address;

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
  }

  async getWallet() {
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
    } else if (window.ethereum) {
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
  }

  async hasWalledConnected() {
    return !!(await this.getWallet()).address;
  }

  async getActiveRound() {
    const activeRound = await this.contract.getActiveRound();
    return {
      name: activeRound.name,
      pot: formatEther(activeRound.pot),
      startDate: new Date(activeRound.startDate.toNumber() * 1000),
      price: await this.getPrice()
    };
  }

  async isOwner() {
    return await this.contract.isOwner();
  }

  async getPlayers() {
    return await this.contract.getPlayers();
  }

  async getHistory() {
    let history = await this.contract.getHistory();
    history = history.map((round) => {
      return {
        name: round.name,
        startDate: new Date(round.startDate.toNumber() * 1000),
        endDate: new Date(round.endDate.toNumber() * 1000),
        winners: round.winners
      }
    });
    return history;
  }

  async getBalance() {
    const balance = await this.contract.getBalance();
    return formatEther(balance);
  }

  async getPrice() {
    const price = await this.contract.getPrice();
    return formatEther(price);
  }

  async buyEntry() {
    const entryPrice = await this.contract.getPrice();
    return await this.contract.buyEntry({value: entryPrice});
  }

  async startLottery(name, price) {
    let dateUnixTimestamp = Math.floor(Date.now() / 1000);
    price = parseEther(price); // Convert Ether to Wei.

    return await this.contract.startLottery(price, name, dateUnixTimestamp);
  }

  async finishLottery() {
    return await this.contract.finishLottery();
  }

  async withdraw() {
    return await this.contract.withdraw();
  }
}