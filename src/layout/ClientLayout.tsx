import React, { useContext } from 'react';

import settings from '../components/settings';
import '../components/utils/styles';

import { Api } from '@polkadot/react-api'
import { SubsocialApiProvider } from '../components/utils/SubsocialApiContext';
import Queue from '@polkadot/react-components/Status/Queue';
import Signer from '@polkadot/react-signer';
import { MyAccountProvider } from '../components/utils/MyAccountContext';
import { Navigation } from './Navigation';
import Connecting from '../components/main/Connecting';
import { BlockAuthors, Events } from '@polkadot/react-query';
import { StatusContext } from '@polkadot/react-components';
import Status from '../components/main/Status';
import AccountsOverlay from '../components/main//overlays/Accounts';
import ConnectingOverlay from '../components/main//overlays/Connecting';
import { getEnv } from '../components/utils/utils';
import { NotifCounterProvider } from '../components/utils/NotifCounter';

const ClientLayout: React.FunctionComponent = ({ children }) => {
  const url = getEnv('SUBSTRATE_URL') || settings.apiUrl || undefined;
  const { queueAction, stqueue, txqueue } = useContext(StatusContext);

  return <Queue>
    <Api url={url}>
      <SubsocialApiProvider>
        <BlockAuthors>
          <Events>
            <MyAccountProvider>
              <Signer>
                <Status
                  queueAction={queueAction}
                  stqueue={stqueue}
                  txqueue={txqueue}
                />
                <Navigation>
                  {children}
                </Navigation>
              </Signer>
              <ConnectingOverlay />
              <AccountsOverlay />
            </MyAccountProvider>
            <Connecting />
          </Events>
        </BlockAuthors>
      </SubsocialApiProvider>
    </Api>
  </Queue>;
};

export default ClientLayout;

