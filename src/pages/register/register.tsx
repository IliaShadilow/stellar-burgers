import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { selectUserError } from '../../services/selectors';
import { registerUser } from '../../services/slices/user/slice';
import { useDispatch, useSelector } from '../../services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    // отправляем данные на сервер
    void dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={error ?? undefined}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
