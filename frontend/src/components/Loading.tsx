import { FC } from 'react';
import loader from '../assets/loadingSpinner.svg';

const Loading: FC = () => {
  return (
    <>
      <img
        src={loader}
        alt="chargement"
        className="animate-spin w-32 h-32 mx-auto mt-44"
      />
    </>
  );
};

export default Loading;
