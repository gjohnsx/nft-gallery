import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import myEpicNft from '../utils/MyEpicNFT.json';

const CONTRACT_ADDRESS = "0xE748E5b19891C9ed0eC1dcd358966168f5f156FA";

export default function Mint() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [mintedNFT, setMintedNFT] = useState(null);
	const [miningStatus, setMiningStatus] = useState(null);
	const [loadingState, setLoadingState] = useState(0);
	const [txError, setTxError] = useState(null);
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [numNftsMinted, setNumNftsMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getMaxSupply = async () => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
        const maxSupplyFromContract = await connectedContract.getMaxSupply();
        setMaxSupply(parseInt(maxSupplyFromContract, 16));
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getNftsMintedSoFar = async () => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
        const mintedSoFar = await connectedContract.getTotalNFTsMintedSoFar();
        setNumNftsMinted(parseInt(mintedSoFar, 16));
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
        const mintedSoFar = await connectedContract.getTotalNFTsMintedSoFar();
        setNumNftsMinted(parseInt(mintedSoFar, 16));
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderNotConnectedContainer = () => (
    <button
      className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
      onClick={connectWallet}
    >
      Connect wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
    console.log('getting max supply only on page load', '*'.repeat(10));
    getMaxSupply();
    getNftsMintedSoFar();
  }, []);

  useEffect(() => {
    getNftsMintedSoFar();
  }, [numNftsMinted])

  console.log('minted so far =', numNftsMinted)
  console.log('max supply =', maxSupply);

  return (
    <>
      <Header />

      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">My NFT Collection</span>
          </h2>
          <p className="mt-2 text-lg leading-6 text-blue-200">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          <div className="mt-2">
            <h3 className="text-xl text-white sm:text-xl">
              {numNftsMinted} / {maxSupply} minted
            </h3>
          </div>

          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button 
            className="my-4 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
            onClick={askContractToMintNft} 
            >
              Mint NFT
            </button>
          )}

        </div>
      </div>
      
      <Footer />
    </>
  );
};