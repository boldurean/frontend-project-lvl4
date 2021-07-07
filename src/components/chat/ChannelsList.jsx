import React, { useEffect } from 'react';
import {
  Button, ButtonGroup, Dropdown, Nav,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../slices';
import fetchChatData from '../../slices/fetchData.js';

const ChannelButton = ({ channel, currentChannelId, showModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { switchChannel } = actions;
  const buttonType = channel.id === currentChannelId ? 'btn btn-secondary' : 'btn';

  if (!channel.removable) {
    return (
      <Nav.Item as="li" bsPrefix="nav-item w-100">
        <Button
          variant={buttonType}
          className="w-100 rounded-0 text-start"
          onClick={() => dispatch(switchChannel(channel.id))}
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>
      </Nav.Item>
    );
  }

  return (
    <Nav.Item as="li" bsPrefix="nav-item w-100">
      <Dropdown as={ButtonGroup} className="d-flex">
        <Button
          variant={buttonType}
          className="w-100 rounded-0 text-start text-truncate"
          onClick={() => dispatch(switchChannel(channel.id))}
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>

        <Dropdown.Toggle split variant={buttonType} id="dropdown-split-basic" />

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => showModal('removing', channel)}>
            {t('buttons.remove')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => showModal('renaming', channel)}>
            {t('buttons.rename')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav.Item>
  );
};

const ChannelsList = (props) => {
  const { showModal } = props;
  const { channelsList, currentChannelId } = useSelector((state) => state.channels);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChatData());
  }, [dispatch]);

  return (
    <Nav as="ul" className="flex-column nav-pills nav-fill px-2">
      {channelsList.map((channel) => (
        <ChannelButton
          key={channel.id}
          channel={channel}
          currentChannelId={currentChannelId}
          showModal={showModal}
        />
      ))}
    </Nav>
  );
};

export default ChannelsList;
