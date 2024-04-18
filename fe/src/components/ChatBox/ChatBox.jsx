import { useEffect, useState } from 'react';
import { connection } from '../../webSocket/connection';
import AutoScrollBottom from '../AutoScrollBottom/AutoScrollBottom';
import logger from '../../utils/logger';

import {
  chatBox, message, sendWrapper, sendForm, blackMsg, whiteMsg, scroller
} from './ChatBox.module.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const updateMessages = (event) => {
      const { message, playerId} = event.detail;

      let className = null;
      if (playerId === 0) {
        className = blackMsg;
      } else if (playerId === 1){
        className = whiteMsg;
      }

      const newMessageWrapper = { message, className};

      setMessages(pmessages => ([newMessageWrapper, ...pmessages]));
      logger.dev('updated messages');
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
    <div id='chatbox' className={`${chatBox} hidden`}>
      <AutoScrollBottom classes={scroller}>
        {messages.map((msgWrapper, ind) => {
          return <p
            key={ind}
            className={`${message} ${msgWrapper.className ?? ''}`}
          >{msgWrapper.message}</p>;
        })}
      </AutoScrollBottom>

      <div id='chatbox_send' className={sendWrapper}>
        <form onSubmit={sendMessage} className={sendForm}>
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