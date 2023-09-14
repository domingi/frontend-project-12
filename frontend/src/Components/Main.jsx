/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Container, Form,
} from 'react-bootstrap';
import cn from 'classnames';
import { v4 as uuid } from 'uuid';
import { actions as channelActions, selectors } from '../slices/channelSlice';
import { Chat, MessageInput } from './Chatbox';

function MainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentChannelId, setCurrentChannelId] = useState(1);
  const currentChannel = useSelector((state) => {
    const channel = selectors.selectById(state, currentChannelId);
    if (!channel) return null;
    return channel.name;
  });

  const getNormalized = (state) => {
    const channelEntities = Object.values(state.channels).map((channel) => ({
      id: channel.id,
      name: channel.name,
    }));
    return channelEntities;
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      axios({
        method: 'get',
        url: '/api/v1/data',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((response) => {
        const channels = getNormalized(response.data);
        dispatch(channelActions.setAll(channels));
        setCurrentChannelId(response.data.currentChannelId);
      });
    }
  }, [navigate, dispatch]);

  return (
    <ChatUI
      currentChannelId={currentChannelId}
      setCurrentChannelId={setCurrentChannelId}
      currentChannel={currentChannel}
    />
  );
}

function GetChannels(currentChannelId, setCurrentChannelId) {
  const channels = useSelector(selectors.selectAll);

  const handleClick = (id) => {
    setCurrentChannelId(id);
  };
  const list = Object.values(channels)
    .map(({ id, name }) => {
      const classes = cn('nav-link', { active: id === currentChannelId });
      return (
        <li className="nav-item" key={name}>
          <a className={classes} aria-current="page" href="#" onClick={() => handleClick(id)}>
            #
            {' '}
            {name}
          </a>
        </li>
      );
    });
  return (
    <ul className="nav flex-column nav-pills">
      {list}
    </ul>
  );
}

function ChatUI({ currentChannelId, setCurrentChannelId, currentChannel }) {
  const [newChannel, setNewChannel] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newChannel);
    dispatch(channelActions.addOne({ id: uuid(), name: newChannel }));
  };

  return (
    <Container className="m-5">
      <Row className="justify-content-md-center">
        <Col xs={2} className="bg-secondary-subtle">
          <div className="d-flex justify-content-between align-items-center p-2">
            <b>Каналы</b>
            <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#addChannel">
              <i className="bi bi-plus-square" />
            </button>
          </div>
          <div className="modal fade" id="addChannel" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Добавить канал</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <Form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        type="text"
                        placeholder="Название канала..."
                        value={newChannel}
                        onChange={(e) => setNewChannel(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>
                    <button type="submit" className="btn btn-primary">Добавить</button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <Row>
            <Col className="p-2">
              {GetChannels(currentChannelId, setCurrentChannelId)}
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>
              <b>
                #
                {' '}
                {currentChannel}
              </b>
            </Col>
          </Row>
          <Row>
            <Col>
              <Chat currentChannelId={currentChannelId} />
            </Col>
          </Row>
          <Row>
            <Col>
              <MessageInput currentChannelId={currentChannelId} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default MainPage;
