import { FC } from 'react';

interface IProps {
  guest: boolean;
  setGuest: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeNavBar: FC<IProps> = ({ guest, setGuest }) => {
  return (
    <>
      <div className="flex md:justify-end justify-center gap-x-10 px-7 py-4 border-b-2 border-lightPrimary bg-lightRed ">
        <button
          onClick={() => {
            setGuest(true);
          }}
          className={`text-white font-semibold px-4 py-2 rounded-md shadow-md shadow-gray-300 ${
            guest
              ? 'bg-tertiaire hover:bg-darkGray'
              : 'bg-lightPrimary hover:bg-primaire'
          }`}
        >
          S'INSCRIRE
        </button>
        <button
          onClick={() => {
            setGuest(false);
          }}
          className={`text-white font-semibold px-4 py-2 rounded-md shadow-md shadow-gray-300 ${
            guest
              ? 'bg-lightPrimary hover:bg-primaire'
              : 'bg-tertiaire hover:bg-darkGray'
          }`}
        >
          SE CONNECTER
        </button>
      </div>
    </>
  );
};

export default HomeNavBar;
