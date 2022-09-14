import React,{useState} from 'react';
import './App.css';
import InputField from './component/inputField'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [amount, setAmount] = useState('');
  const [senderAccNo, setSenderAccNo] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recieverAccNo, setRecieverAccNo] = useState('');
  const [recieverName, setRecieverName] = useState('');

  const notify = () => toast.success("Money Transfered successfully!");
  const notifyError = (message) => toast.error(message);

  async function handleSubmit(event) {
    event.preventDefault();
    const body = {
      amount: amount,
      senderAccNo: senderAccNo,
      senderName: senderName,
      recieverAccNo:recieverAccNo,
      recieverName:recieverName
    };
    await axios
      .post(`https://8n7whniffj.execute-api.us-east-1.amazonaws.com/dev/sendMoney`, body)
      .then((res) => {
          console.log('Done');
          setAmount('');
          setSenderAccNo('');
          setSenderName('');
          setRecieverAccNo('');
          setRecieverName('');
          notify();
      })
      .catch((error) => {
        
        notifyError(error.response.data);
      });
  }


  return (
    <>
    <h1 className='title'>Money Transfer Tool</h1>
    <div className="App">
    
    <ToastContainer />
      <div className="card">
      
        <form onSubmit={handleSubmit}>
          <div>
            <InputField
              htmlFor="senderName"
              label="Sender name"
              id="senderName"
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>
          <div>
            <InputField
                htmlFor="senderAccNo"
                label="Sender Account No"
                id="senderAccNo"
                type="number"
                value={senderAccNo}
                onChange={(e) => setSenderAccNo(e.target.value)}
              />
          </div>
          <div>
            <InputField
                htmlFor="amount"
                label="Amount"
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          <div>
            <InputField
                htmlFor="recieverName"
                label="Reciever name"
                id="senderName"
                type="text"
                value={recieverName}
                onChange={(e) => setRecieverName(e.target.value)}
              />
            </div>
          <div>
          <InputField
                htmlFor="recieverAccNo"
                label="Reciever Account No"
                id="recieverAccNo"
                type="number"
                value={recieverAccNo}
                onChange={(e) => setRecieverAccNo(e.target.value)}
              />
          </div>
          <button type="submit" className='btn'>Submit</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default App;
