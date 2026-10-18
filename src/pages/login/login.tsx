import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { selectUserError } from '../../services/selectors';
import { loginUser } from '../../services/slices/user/slice';
import { useDispatch, useSelector } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error ?? undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
