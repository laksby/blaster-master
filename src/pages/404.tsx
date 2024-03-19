import { FC } from 'react';

export const NotFoundPage: FC = () => {
  return (
    <div className="tw-p-4 tw-h-screen tw-flex tw-items-center tw-justify-center">
      <div className="tw-text-2xl">Sorry! Requested page not found</div>
    </div>
  );
};

export default NotFoundPage;
