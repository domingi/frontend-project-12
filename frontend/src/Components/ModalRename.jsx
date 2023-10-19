/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Form, Button, Modal,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { close } from '../slices/modalSlice';
import { emits } from '../socket';

const ModalRename = ({ props: { сhannelSchema, choosenChannel } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channelName = useRef(null);
  useEffect(() => {
    if (channelName.current !== null) {
      channelName.current.select();
    }
  });

  const isShow = useSelector((state) => state.modals.show) === 'modalRename';
  const handleClose = () => dispatch(close());

  return (
    <Modal show={isShow} onHide={handleClose}>
      <Formik
        validationSchema={сhannelSchema}
        validateOnChange={false}
        onSubmit={(values) => {
          handleClose();
          const { id } = choosenChannel;
          const channel = { name: values.channel, id };
          emits.renameChannel(channel);
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
              <Button variant="secondary" onClick={handleClose}>
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
  );
};

export default ModalRename;
