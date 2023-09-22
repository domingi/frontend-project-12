/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Form, Button, Modal,
} from 'react-bootstrap';
import cn from 'classnames';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { NetStatusContext } from '../contexts';
import { actions, selectors } from '../slices/channelSlice';
import socket from '../socket';

function GetChannels(currentChannelId, setCurrentChannelId, сhannelSchema) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  useEffect(() => {
    socket.on('renameChannel', (channel) => {
      console.log(channel);
      dispatch(actions.updateOne({ id: channel.id, changes: { ...channel } }));
    });
  }, [dispatch]);
  const channels = useSelector(selectors.selectAll);
  const net = useContext(NetStatusContext);

  const handleClick = (id) => {
    setCurrentChannelId(id);
  };

  const [choosenChannel, setChoosen] = useState({});

  const [showModalRemove, setShowRemove] = useState(false);
  const handleCloseModalRemove = () => setShowRemove(false);
  const handleShowModalRemove = (e, id) => {
    e.preventDefault();
    setShowRemove(true);
    setChoosen({ id });
  };

  const handleClickRemove = () => {
    const { id } = choosenChannel;
    dispatch(actions.removeOne(id));
    socket.emit('removeChannel', { id }, (response) => {
      console.log(response.status);
      if (response.status !== 'ok') {
        net.setStatus(false);
      } else {
        net.setStatus(true);
      }
    });

    if (id === currentChannelId) {
      setCurrentChannelId(1);
    }
    handleCloseModalRemove();
  };

  const [showModalRename, setShowRename] = useState(false);
  const handleCloseModalRename = () => setShowRename(false);
  const handleShowModalRename = (e, id, name) => {
    e.preventDefault();
    setChoosen({ id, name });
    setShowRename(true);
  };

  const list = Object.values(channels)
    .map(({ id, name, removable }) => {
      const classes = cn('btn', 'rounded-0', 'w-100', 'text-start', { 'btn-secondary': id === currentChannelId });
      const classesForDropdown = cn('dropdown-toggle', 'btn', { 'btn-secondary': id === currentChannelId });
      if (removable) {
        return (
          <li className="nav-item w-100" key={name}>
            <div className="btn-group w-100" role="group">
              <button type="button" className={classes} onClick={() => handleClick(id)}>
                #
                {' '}
                {name}
              </button>
              <div className="btn-group" role="group">
                <button type="button" className={classesForDropdown} data-bs-toggle="dropdown" aria-expanded="false">
                  <span className="visually-hidden">{t('channels.hidebar')}</span>
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" onClick={(e) => handleShowModalRemove(e, id)} href="#">{t('channels.remove')}</a></li>
                  <li><a className="dropdown-item" onClick={(e) => handleShowModalRename(e, id, name)} href="#">{t('channels.rename')}</a></li>
                </ul>
              </div>
            </div>
          </li>
        );
      }
      return (
        <li className="nav-item w-100" key={name}>
          <button type="button" className={classes} onClick={() => handleClick(id)}>
            #
            {' '}
            {name}
          </button>
        </li>
      );
    });
  return (
    <ul className="nav flex-column">
      {list}
      <Modal show={showModalRemove} onHide={handleCloseModalRemove}>
        <Modal.Header closeButton>
          <Modal.Title>{t('channels.modalRemoveTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('channels.modalRemoveBody')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalRemove}>
            {t('channels.modalCancel')}
          </Button>
          <Button variant="danger" onClick={handleClickRemove}>
            {t('channels.modalConfirm')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalRename} onHide={handleCloseModalRename}>
        <Formik
          validationSchema={сhannelSchema}
          validateOnChange={false}
          onSubmit={(values) => {
            handleCloseModalRename();
            const { id } = choosenChannel;
            const channel = { name: values.channel, id };
            socket.emit('renameChannel', channel, (response) => {
              console.log(response.status);
              if (response.status !== 'ok') {
                net.setStatus(false);
              } else {
                net.setStatus(true);
              }
            });
          }}
          initialValues={{
            channel: choosenChannel.name,
          }}
        >
          {({
            handleSubmit, handleChange, values, errors,
          }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <Modal.Header closeButton>
                <Modal.Title>{t('channels.modalRename')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="channel"
                    value={values.channel}
                    onChange={handleChange}
                    isInvalid={!!errors.channel}
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">{errors.channel}</Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalRename}>
                  {t('channels.modalCancel')}
                </Button>
                <Button variant="primary" type="submit">
                  {t('channels.modalConfirm')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </ul>

  );
}

function ChannelBox({ currentChannelId, setCurrentChannelId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const net = useContext(NetStatusContext);

  const channels = useSelector(selectors.selectAll);
  const channelsNames = Object.values(channels).map((channel) => channel.name);
  const сhannelSchema = Yup.object().shape({
    channel: Yup.string().min(3, 'От 3 до 20 символов').max(20, 'От 3 до 20 символов').required('Введите название канала')
      .notOneOf(channelsNames, 'Должно быть уникальным'),
  });

  const [showModal, setShow] = useState(false);
  const handleCloseModal = () => setShow(false);
  const handleShowModal = () => setShow(true);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-2">
        <b>{t('channels.title')}</b>
        <Button variant="link" onClick={handleShowModal}>
          <i className="bi bi-plus-square" />
        </Button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Formik
          validationSchema={сhannelSchema}
          onSubmit={(values) => {
            handleCloseModal();
            const channel = { name: values.channel, removable: true };
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
                <Modal.Title>{t('channels.modalAddTitle')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="channel"
                    value={values.channel}
                    onChange={handleChange}
                    isInvalid={!!errors.channel}
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">{errors.channel}</Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  {t('channels.modalCancel')}
                </Button>
                <Button variant="primary" type="submit">
                  {t('channels.modalConfirm')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <Row>
        <Col className="p-2">
          {GetChannels(currentChannelId, setCurrentChannelId, сhannelSchema)}
        </Col>
      </Row>
    </>
  );
}

export default ChannelBox;
