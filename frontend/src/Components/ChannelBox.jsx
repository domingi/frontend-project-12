/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useState, useRef, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import cn from 'classnames';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { actions, selectors } from '../slices/channelSlice';
import { showRename, showRemove, showNew } from '../slices/modalSlice';
import ModalRename from './ModalRename';
import ModalRemove from './ModalRemove';
import ModalNewChannel from './ModalNewChannel';

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

  const handleShowModalRemove = (e, id) => {
    e.preventDefault();
    setChoosen({ id });
    dispatch(showRemove());
  };

  const handleShowModalRename = (e, id, name) => {
    e.preventDefault();
    setChoosen({ id, name });
    dispatch(showRename());
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
      <ModalRemove props={{ choosenChannel }} />
      <ModalRename props={{ сhannelSchema, choosenChannel }} />
    </>
  );
};

const ChannelBox = ({ currentChannelId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const channelWindow = useRef(null);

  const channels = useSelector(selectors.selectAll);
  const channelsNames = Object.values(channels).map((channel) => channel.name);
  const сhannelSchema = Yup.object().shape({
    channel: Yup.string().required(t('errors.required'))
      .min(3, t('errors.nameLength')).max(20, t('errors.nameLength'))
      .trim()
      .notOneOf(channelsNames, t('errors.wrongName')),
  });

  const handleShowModal = () => dispatch(showNew());

  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-2">
        <b>{t('channels.title')}</b>
        <Button variant="link" onClick={handleShowModal}>
          <i className="bi bi-plus-square" />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ModalNewChannel props={{ сhannelSchema, channelWindow }} />
      <ul className="nav overflow-auto h-100 pb-3 d-block" ref={channelWindow}>
        <ChannelList props={{ currentChannelId, сhannelSchema }} />
      </ul>
    </>
  );
};

export default ChannelBox;
