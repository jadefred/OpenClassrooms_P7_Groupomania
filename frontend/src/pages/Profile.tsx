import { useState, FC } from 'react';
import useFlashMessage from '../hooks/useFlashMessage';

//components
import NavBar from '../components/NavBar';
import UserProfile from '../components/UserProfile';
import FlashMessage from '../components/FlashMessage';
import DeleteUser from '../components/DeleteUser';

const Profile: FC = () => {
  const { flashMessage, setFlashMessage } = useFlashMessage();
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false);

  return (
    <>
      <NavBar />
      {flashMessage !== '' && <FlashMessage flashMessage={flashMessage} />}

      {!deleteAccount ? (
        <UserProfile
          setFlashMessage={setFlashMessage}
          setDeleteAccount={setDeleteAccount}
        />
      ) : (
        <DeleteUser />
      )}
    </>
  );
};

export default Profile;
