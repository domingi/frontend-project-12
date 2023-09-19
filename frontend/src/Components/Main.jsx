/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Container,
} from 'react-bootstrap';
import { actions as channelsActions, selectors } from '../slices/channelSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import { Chat, MessageInput } from './Chatbox';
import ChannelBox from './Channels';

function MainPage() {
  const [currentChannelId, setCurrentChannelId] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentChannel = useSelector((state) => {
    const channel = selectors.selectById(state, currentChannelId);
    if (!channel) return null;
    return channel.name;
  });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      axios({
        method: 'get',
        url: '/api/v1/data',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((response) => {
        dispatch(channelsActions.setAll(response.data.channels));
        dispatch(messagesActions.setAll(response.data.messages));
        setCurrentChannelId(response.data.currentChannelId);
      });
    }
  }, [navigate, dispatch]);

  return (
    <Container className="m-5">
      <Row className="justify-content-md-center">
        <Col xs={2} className="bg-light-subtle shadow">
          <ChannelBox
            currentChannelId={currentChannelId}
            setCurrentChannelId={setCurrentChannelId}
          />
        </Col>
        <Col>
          <Row className="mb-3">
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
