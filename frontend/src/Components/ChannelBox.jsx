/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useState, useRef, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, Button, Modal,
} from 'react-bootstrap';
import cn from 'classnames';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { actions, selectors } from '../slices/channelSlice';
import socket from '../socket';
import { notifyError, notifySucces } from './notifications';

const ChannelList = ({ props: { currentChannelId, сhannelSchema } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);

  const channelName = useRef(null);
  useEffect(() => {
    if (channelName.current !== null) {
      channelName.current.select();
    }
  });

  const handleClick = (id) => {
    dispatch(actions.setCurrentId(id));
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
    socket.emit('removeChannel', { id }, (response) => {
      if (response.status !== 'ok') {
        notifyError(t('notify.socketError'));
      }
      if (response.status === 'ok') {
        notifySucces(t('notify.remove'));
      }
    });
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
      const classes = cn('btn', 'rounded-0', 'w-100', 'text-start', 'text-truncate', { 'btn-secondary': id === currentChannelId });
      const classesForDropdown = cn('dropdown-toggle', 'btn', { 'btn-secondary': id === currentChannelId });
      if (removable) {
        return (
          <li className="nav-item w-100" key={name}>
            <div className="btn-group w-100" role="group">
              <button type="button" className={classes} onClick={() => handleClick(id)}>
                #&nbsp;
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
            #&nbsp;
            {name}
          </button>
        </li>
      );
    });

  return (
    <>
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
            {t('channels.remove')}
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
              if (response.status !== 'ok') {
                notifyError(t('notify.socketError'));
              }
              if (response.status === 'ok') {
                notifySucces(t('notify.rename'));
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
                  <Form.Label htmlFor="channel" visuallyHidden>{t('channels.name')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="channel"
                    id="channel"
                    value={values.channel}
                    onChange={handleChange}
                    isInvalid={!!errors.channel}
                    autoFocus
                    ref={channelName}
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
    </>
  );
};

const ChannelBox = ({ currentChannelId }) => {
  const { t } = useTranslation();
  const channelWindow = useRef(null);
  const dispatch = useDispatch();

  const channels = useSelector(selectors.selectAll);
  const channelsNames = Object.values(channels).map((channel) => channel.name);
  const сhannelSchema = Yup.object().shape({
    channel: Yup.string().required(t('errors.required'))
      .min(3, t('errors.nameLength')).max(20, t('errors.nameLength'))
      .trim()
      .notOneOf(channelsNames, t('errors.wrongName')),
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
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Formik
          validationSchema={сhannelSchema}
          validateOnChange={false}
          onSubmit={(values) => {
            handleCloseModal();
            const channel = { name: values.channel, removable: true };
            socket.emit('newChannel', channel, (response) => {
              if (response.status !== 'ok') {
                notifyError(t('notify.socketError'));
              }
              if (response.status === 'ok') {
                dispatch(actions.addOne(response.data));
                dispatch(actions.setCurrentId(response.data.id));
                notifySucces(t('notify.add'));
                if (channelWindow.current !== null) {
                  setTimeout(() => {
                    channelWindow.current.scrollTop = channelWindow.current.scrollHeight;
                  }, 500);
                }
              }
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
                  <Form.Label htmlFor="channel" visuallyHidden>{t('channels.name')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="channel"
                    id="channel"
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
      <ul className="nav overflow-auto h-100 pb-3 d-block" ref={channelWindow}>
        <ChannelList props={{ currentChannelId, сhannelSchema }} />
      </ul>
    </>
  );
};

export default ChannelBox;
