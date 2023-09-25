/* eslint-disable react/prop-types */
import React, {
  useState, useContext, useRef, useEffect,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, InputGroup } from 'react-bootstrap';
import { selectors } from '../slices/messagesSlice';
import { AuthContext, NetStatusContext } from '../contexts';
import socket from '../socket';
import ButtonSend from './ButtonSend';
import { notifyError } from './notifications';

export function Chat({ currentChannelId }) {
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
  return list;
}

export function MessageInput({ currentChannelId }) {
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
    const message = { body: newMessage, user: auth.username, channelId: currentChannelId };
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
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder={t('chatbox.input')}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!net.status}
          ref={inputRef}
          className="border-end-0 border-secondary-subtle"
        />
        <ButtonSend />
      </InputGroup>
      {!net.status
        && (
        <p className="text-danger small">
          {t('errors.net')}
        </p>
        )}
    </Form>
  );
}
