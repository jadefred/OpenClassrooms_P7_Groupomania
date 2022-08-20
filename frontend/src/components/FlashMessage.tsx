import { FC } from 'react';

type IProps = { flashMessage: string };

const FlashMessage: FC<IProps> = ({ flashMessage }) => {
  return (
    <div className="bg-emerald-700 w-72 mx-auto px-4 py-2 text-center rounded-md my-2">
      <p className="text-white">{flashMessage}</p>
    </div>
  );
};

export default FlashMessage;
