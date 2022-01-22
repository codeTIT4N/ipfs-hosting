import Hello from './artifacts/Hello.json'
import { useEffect, useState } from 'react';
import './App.css';
import detectEthereumProvider from '@metamask/detect-provider';
import { Button } from 'react-bootstrap';


function App() {
  const [account, setAccount] = useState();
  useEffect(() => {
    load();
    loadBlockchaindata();
  }, [account])
  const [connected, setConnected] = useState(false);
  const [toSubmit, setToSubmit] = useState({});
  const [email, setEmail] = useState();
  const [twitter, setTwitter] = useState();
  const [discord, setDiscord] = useState();

  const load = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      // From now on, this should always be true:
      // provider === window.ethereum
      startApp(provider);
      provider
        .request({ method: 'eth_accounts' })
        .then(accounts => {
          setAccount(accounts[0]);
          let currentAccount = accounts[0];
          if (currentAccount)
            setConnected(true);
          else
            setConnected(false)
        })
        .catch((err) => {
          // Some unexpected error.
          // For backwards compatibility reasons, if no accounts are available,
          // eth_accounts will return an empty array.
          console.error(err);
        });

    } else {
      alert('Please install MetaMask!');
    }
  }
  function startApp(provider) {
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      console.log('Do you have multiple wallets installed?');
    }
    // Access the decentralized web!
  }
  const loadBlockchaindata = async () => {
    // const web3 = window.web3;
    // const networkData = await Hello.networks[4];
    // if (networkData) {
    //   //   console.log(networkData);
    //   // const contract = window.web3.eth.Contract(Hello.abi, networkData.address);
    //   //   // console.log(contract);
    // }
  }
  function connect() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        setConnected(true)
        setAccount(accounts[0])
      })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  }
  const [err, setErr] = useState("")
  const handleSubmit = () => {
    if (connected && email && twitter && discord) {
      setErr("")
      let toSend = {}
      toSend["email"] = email;
      toSend["twitter"] = twitter;
      toSend["discord"] = discord;
      console.log(toSend);
    }
    else
      setErr("Please fill all the fields and connect your metamask account using the connect button above!!!")
  }
  return (
    <>
      <h3>Hello:  {connected ? account : <Button variant="primary" onClick={connect}>Connect</Button>}
      </h3>
      <hr />
      <h3>Form:</h3>
      <div style={{
        display: "flex",
        alignItems: "center"
      }}>
        <span>Email: </span>
        <input type="email" placeholder='Email' required onChange={(e) => {
          setEmail(e.target.value);
        }} />
        <br />
        <span>Twitter: </span>
        <input type="text" placeholder='twitter link' required onChange={(e) => {
          setTwitter(e.target.value);
        }} />
        <br />
        <span>Discord: </span>
        <input type="text" placeholder='discord handle' required onChange={(e) => {
          setDiscord(e.target.value);
        }} />
        <Button variant='success' onClick={handleSubmit}>Submit</Button>
      </div>
      <br />
      <h5 style={{ color: 'red' }}>{err}</h5>
      <hr />
    </>)
}

export default App;
