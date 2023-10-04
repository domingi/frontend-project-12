/* eslint-disable react/prop-types */
import React, {
  useState, useContext, useRef, useEffect,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, InputGroup, Button } from 'react-bootstrap';
import filter from 'leo-profanity';
import { selectors } from '../slices/messagesSlice';
import { AuthContext, NetStatusContext } from '../contexts';
import socket from '../socket';
import { notifyError } from './notifications';

export const Chat = ({ currentChannelId }) => {
  const chatWindow = useRef(null);
  useEffect(() => {
    if (chatWindow.current !== null) {
      chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
    }
  });

  const messages = useSelector(selectors.selectAll);
  if (messages.length === 0) return null;
  const messagesForChannel = messages.filter(({ channelId }) => channelId === currentChannelId);
  const list = Object.values(messagesForChannel)
    .map(({ id, body, user }) => (
      <p key={id}>
        <span className="fw-bold">
          {user}
          :
        </span>
        {' '}
        {body}
      </p>
    ));
  return (
    <div className="overflow-auto p-3 text-break" ref={chatWindow}>
      {list}
    </div>
  );
};

export const MessageInput = ({ currentChannelId }) => {
  const { t } = useTranslation();

  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  });

  const [newMessage, setNewMessage] = useState('');
  const auth = useContext(AuthContext);
  const net = useContext(NetStatusContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(auth);
    const filteredMessage = filter.clean(newMessage);
    const message = { body: filteredMessage, user: auth.username, channelId: currentChannelId };
    socket.emit('newMessage', message, (response) => {
      if (response.status !== 'ok') {
        net.setStatus(false);
        notifyError(t('notify.sendError'));
      } else {
        net.setStatus(true);
        setNewMessage('');
      }
    });
  };

  return (
    <div className="mt-auto p-3">
      <Form onSubmit={handleSubmit}>
        <InputGroup className="mb-3 border rounded-2">
          <Form.Control
            id="chatInput"
            name="chatInput"
            placeholder={t('chatbox.input')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!net.status}
            ref={inputRef}
            className="border-0 rounded-2"
            aria-label={t('chatbox.newMessage')}
          />
          <Form.Label htmlFor="chatInput" visuallyHidden>{t('chatbox.input')}</Form.Label>
          <Button
            variant={null}
            disabled={newMessage === ''}
            className="border-0"
            type="submit"
          >
            <i className="bi bi-arrow-right-square" />
          </Button>

        </InputGroup>
        {!net.status
          && (
          <p className="text-danger small">
            {t('errors.net')}
          </p>
          )}
      </Form>
    </div>
  );
};
