import React, { useState } from 'react';

import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { isMobile } from 'react-device-detect';
import { Avatar, Divider } from 'antd';
import { ChooseAccountFromExtension } from './PolkadotExtension';

type LogInButtonProps = {
  size?: string,
  link?: boolean
  title?: string
};

export function LogInButton ({ link, title = 'Sign in' }: LogInButtonProps) {
  const [ open, setOpen ] = useState(false);

  return <>
    <Button size={isMobile ? 'small' : 'default'} type={link ? 'link' : 'primary'} className={link ? 'DfBlackLink' : ''} onClick={() => setOpen(true)}>{title}</Button>
    {open && <LogInModal open={open} hide={() => setOpen(false)} />}
  </>;
}

type ModalProps = {
  open: boolean
  hide: () => void
};

const LogInModal = (props: ModalProps) => {
  const { open = false, hide } = props;

  return <Modal
    visible={open}
    title={<h3 style={{ fontWeight: 'bold' }}>{`Sign in with Polkadot{.js} extension`}</h3>}
    onOk={hide}
    footer={null}
    width={428}
    className='text-center'
    onCancel={hide}
  >
    <div className='p-4 pt-0'>
      <ChooseAccountFromExtension />
      <Divider>or</Divider>
      <div className='mb-2'>Alternatively, you can create a new account right here on the site.</div>
      <Button block type='default' href='/bc/#/accounts' target='_blank' >
        <Avatar size={18} src='substrate.svg' />
        <span className='ml-2'>Create account</span>
      </Button>
    </div>
  </Modal>;
};

export default LogInButton;
