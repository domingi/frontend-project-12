/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Form, Button, Modal,
} from 'react-bootstrap';
import cn from 'classnames';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NetStatusContext } from '../contexts';
import { actions, selectors } from '../slices/channelSlice';
import socket from '../socket';

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

function ChannelBox({ currentChannelId, setCurrentChannelId }) {
  const dispatch = useDispatch();
  const net = useContext(NetStatusContext);
  const channels = useSelector(selectors.selectAll);
  const channelsNames = Object.values(channels).map((channel) => channel.name);

  const [showModal, setShow] = useState(false);
  const handleCloseModal = () => setShow(false);
  const handleShowModal = () => setShow(true);

  const ChannelSchema = Yup.object().shape({
    channel: Yup.string().min(3, 'От 3 до 20 символов').max(20, 'От 3 до 20 символов').required('Введите название канала')
      .notOneOf(channelsNames, 'Должно быть уникальным'),
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-2">
        <b>Каналы</b>
        <Button variant="link" onClick={handleShowModal}>
          <i className="bi bi-plus-square" />
        </Button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Formik
          validationSchema={ChannelSchema}
          onSubmit={(values) => {
            handleCloseModal();
            const channel = { name: values.channel };
            socket.emit('newChannel', channel, (response) => {
              console.log(response.status);
              if (response.status !== 'ok') {
                net.setStatus(false);
              } else {
                net.setStatus(true);
              }
            });
            socket.on('newChannel', (channelWithId) => {
              dispatch(actions.addOne(channelWithId));
              setCurrentChannelId(channelWithId.id);
            });
          }}
          initialValues={{
            channel: '',
          }}
        >
          {({
            handleSubmit, handleChange, values, errors,
          }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <Modal.Header closeButton>
                <Modal.Title>Добавить канал</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="channel"
                    value={values.channel}
                    onChange={handleChange}
                    isInvalid={!!errors.channel}
                  />
                  <Form.Control.Feedback type="invalid">{errors.channel}</Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Отменить
                </Button>
                <Button variant="primary" type="submit">
                  Отправить
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <Row>
        <Col className="p-2">
          {GetChannels(currentChannelId, setCurrentChannelId)}
        </Col>
      </Row>
    </>
  );
}

export default ChannelBox;
