/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Container, Button, Form, InputGroup,
} from 'react-bootstrap';
import cn from 'classnames';
import { setAll as setAllChannels, selectors } from '../slices/channelSlice';

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
        dispatch(setAllChannels(channels));
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

function MessageInput() {
  return (
    <InputGroup className="mb-3">
      <Form.Control
        placeholder="Введите сообщение"
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
      />
      <Button variant="outline-secondary" id="button-addon2">
        <i className="bi bi-arrow-right-square" />
      </Button>
    </InputGroup>
  );
}

// eslint-disable-next-line react/prop-types
function ChatUI({ currentChannelId, setCurrentChannelId, currentChannel }) {
  return (
    <Container className="m-5">
      <Row className="justify-content-md-center h-100">
        <Col xs={2} className="bg-secondary-subtle">
          <div className="d-flex justify-content-between align-items-center p-2">
            <b>Каналы</b>
            <button type="button" className="btn btn-link">
              <i className="bi bi-plus-square" />
            </button>
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
              окно с сообщениями
            </Col>
          </Row>
          <Row>
            <Col>
              <MessageInput />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default MainPage;
