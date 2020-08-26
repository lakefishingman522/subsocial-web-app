import React from 'react';
import { registerSubsocialTypes } from '../components/types';
import ClientLayout from './ClientLayout';

const NextLayout: React.FunctionComponent = ({ children }) => {
  registerSubsocialTypes();

  return <ClientLayout>{children}</ClientLayout>;
};

export default NextLayout;
