import React from 'react';

import settings from '../components/settings';
import '../components/utils/styles';

import Api from '../components/utils/Api'
import { SubsocialApiProvider } from '../components/utils/SubsocialApiContext';
import Queue from '@polkadot/react-components/Status/Queue';
import Signer from '@polkadot/react-signer';
import { MyAccountProvider } from '../components/utils/MyAccountContext';
import Connecting from '../components/main/Connecting';
import { BlockAuthors, Events } from '@polkadot/react-query';
import AccountsOverlay from '../components/main//overlays/Accounts';
import ConnectingOverlay from '../components/main//overlays/Connecting';
import { getEnv } from '../components/utils/utils';
import { NotifCounterProvider } from '../components/utils/NotifCounter';
import { Content } from '../components/main/Content';

const ClientLayout: React.FunctionComponent = ({ children }) => {
  const url = getEnv('SUBSTRATE_URL') || settings.apiUrl || undefined;

  return <Queue>
    <Api url={url}>
      <SubsocialApiProvider>
        <BlockAuthors>
          <Events>
            <MyAccountProvider>
              <NotifCounterProvider>
                <Signer>
                  <Content>
                    {children}
                  </Content>
                </Signer>
                <ConnectingOverlay />
                <AccountsOverlay />
              </NotifCounterProvider>
            </MyAccountProvider>
            <Connecting />
          </Events>
        </BlockAuthors>
      </SubsocialApiProvider>
    </Api>
  </Queue>;
};

export default ClientLayout;
