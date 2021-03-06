import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, IconButton } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import RedoIcon from '@material-ui/icons/Redo';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import KeyboardHideIcon from '@material-ui/icons/KeyboardHide';
import SettingsIcon from '@material-ui/icons/Settings';
import InboxIcon from '@material-ui/icons/Inbox';
import PeopleIcon from '@material-ui/icons/People';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import './EmailList.css';
import Section from './Section';
import EmailRow from './EmailRow';
import { db } from '../firebase';
import { selectUser } from '../features/userSlice';
import { selectInbox, setEmailCount } from '../features/sidebarSlice';
import { selectSendMessageIsOpen } from '../features/mailSlice';

function EmailList() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const inbox = useSelector(selectInbox);
  const isMsgOpen = useSelector(selectSendMessageIsOpen);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    db.collection('emails')
      .where(`${inbox ? 'to' : 'from'}.email`, '==', user.email)
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) =>
        setEmails(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    // console.log(emails);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inbox, isMsgOpen]);
  dispatch(setEmailCount(emails.length));

  return (
    <div className="emailList">
      <div className="emailList__settings">
        <div className="emailList__settingsLeft">
          <Checkbox />

          <IconButton>
            <ArrowDropDownIcon />
          </IconButton>

          <IconButton>
            <RedoIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>

        <div className="emailList__settingsRight">
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>

          <IconButton>
            <ChevronRightIcon />
          </IconButton>

          <IconButton>
            <KeyboardHideIcon />
          </IconButton>

          <IconButton>
            <SettingsIcon />
          </IconButton>
        </div>
      </div>

      <div className="emailList__sections">
        <Section Icon={InboxIcon} title="Primary" color="red" selected />
        <Section Icon={PeopleIcon} title="Social" color="#1A73E8" />
        <Section Icon={LocalOfferIcon} title="Promotions" color="green" />
      </div>

      <div className="emailList__list">
        {emails.map(
          ({ id, data: { from, to, subject, message, timestamp } }) => (
            <EmailRow
              key={id}
              id={id}
              title={inbox ? from.displayName : to.displayName}
              subject={subject}
              description={message}
              time={new Date(timestamp?.seconds * 1000).toUTCString()}
            />
          )
        )}
      </div>
    </div>
  );
}

export default EmailList;
