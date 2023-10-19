/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { close } from '../slices/modalSlice';
import { emits } from '../socket';

const ModalRemove = ({ props: { choosenChannel } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isShow = useSelector((state) => state.modals.show) === 'modalRemove';
  const handleClose = () => dispatch(close());
  const handleClickRemove = () => {
    handleClose();
    const { id } = choosenChannel;
    emits.removeChannel(id);
  };

  return (
    <Modal show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.modalRemoveTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('channels.modalRemoveBody')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('channels.modalCancel')}
        </Button>
        <Button variant="danger" onClick={handleClickRemove}>
          {t('channels.remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRemove;
