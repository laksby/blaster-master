import { FC } from 'react';

export const IndexPage: FC = () => {
  return <main>{new Date().toUTCString()}</main>;
};

export default IndexPage;
