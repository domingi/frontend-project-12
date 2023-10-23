/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions, selectors } from '../slices/channelSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import { Chat, MessageInput } from '../Components/ChatBox';
import AuthContext from '../contexts';
import ChannelBox from '../Components/ChannelBox';
import { notifyError } from '../notifications';
import Navbar from '../Components/Navbar';
import pathes from '../routes/index';

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  const currentChannelId = useSelector((state) => state.channels.currentId);

  const currentChannel = useSelector((state) => {
    const channel = selectors.selectById(state, currentChannelId);
    if (!channel) return null;
    return channel.name;
  });

  useEffect(() => {
    if (auth.checkAndAuth()) {
      axios({
        method: 'get',
        url: pathes.api.data,
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      }).then((response) => {
        dispatch(channelsActions.setAll(response.data.channels));
        dispatch(messagesActions.setAll(response.data.messages));
      }).catch((e) => {
        switch (e.response?.status) {
          case 401:
            auth.logOut();
            break;
          default:
            notifyError(t('notify.serverError'));
        }
      });
    } else {
      navigate(pathes.login);
    }
  }, [navigate, dispatch, auth, t]);

  return (
    <div className="d-flex flex-column h-100">
      <Navbar />
      <Container className="h-100 shadow-sm my-3 overflow-auto">
        <Row className="justify-content-center align-items-center h-100 shadow">
          <Col xs={4} md={3} className="bg-light shadow h-100 d-flex flex-column">
            <ChannelBox currentChannelId={currentChannelId} />
          </Col>
          <Col className="h-100 p-0">
            <div className="d-flex flex-column h-100">
              <div className="bg-light shadow-sm p-3">
                <b>
                  #
                  {' '}
                  {currentChannel}
                </b>
              </div>
              <Chat currentChannelId={currentChannelId} />
              <MessageInput currentChannelId={currentChannelId} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainPage;
