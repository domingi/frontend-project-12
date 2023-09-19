/* eslint-disable react/prop-types */
import React, {
  useState, useContext, useRef, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, InputGroup } from 'react-bootstrap';
import { actions, selectors } from '../slices/messagesSlice';
import { AuthContext, NetStatusContext } from '../contexts';
import socket from '../socket';
import ButtonSend from './ButtonSend';

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
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  });

  const [newMessage, setNewMessage] = useState('');
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  const net = useContext(NetStatusContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = { body: newMessage, user: auth.username, channelId: currentChannelId };
    socket.emit('newMessage', message, (response) => {
      console.log(response.status);
      if (response.status !== 'ok') {
        net.setStatus(false);
      } else {
        net.setStatus(true);
      }
    });
    socket.on('newMessage', (messageWithId) => {
      dispatch(actions.addOne(messageWithId));
    });
    setNewMessage('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Введите сообщение"
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
        <p className="text-danger">
          Ошибка соединения. Обновите страницу и попробуйте ещё раз.
        </p>
        )}
    </Form>
  );
}
