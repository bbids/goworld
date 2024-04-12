import { useEffect, useState } from 'react';
import { connection } from '../webSocket/connection';
import Scroller from './Scroller';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const updateMessages = (event) => {
      const msg = event.detail.message;
      setMessages(pmessages => ([msg, ...pmessages]));
      console.log('updated messages');
    };

    document.addEventListener('msgEvent', updateMessages);

    return () => {
      document.removeEventListener('msgEvent', updateMessages);
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    connection.send(JSON.stringify({
      type: 'EVENT',
      eventName: 'MESSAGE',
      message: input
    }));
    setInput('');
  };

  const updateInput = (event) => {
    setInput(event.target.value);
  };


  return (
    <div id='chatbox'>
      <Scroller>
        {messages.map((msg, ind) => {
          return <p key={ind}>{msg}</p>;
        })}
      </Scroller>

      <div id='chatbox_send'>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            onChange={updateInput}
            value={input} />
          <button
            type='submit'>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;