import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { selectUser, selectUserError } from '../../services/selectors';
import { updateUser } from '../../services/slices/user/slice';
import { useDispatch, useSelector } from '../../services/store';

import type { TRegisterData } from '@api';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUserError);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  // используем useEffect, он нужен, чтобы обновлять форму после сохранения
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name ?? '',
        email: user.email ?? '',
        password: '', // пароль всегда сбрасываем
      });
    }
  }, [user]); // срабатывает при изменении user в Redux

  const isFormChanged =
    formValue.name !== (user?.name ?? '') ||
    formValue.email !== (user?.email ?? '') ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const payload: Partial<TRegisterData> = {};
    // отправляем только то, что изменилось
    if (formValue.name !== user?.name) payload.name = formValue.name;
    if (formValue.email !== user?.email) payload.email = formValue.email;
    if (formValue.password) payload.password = formValue.password;

    void dispatch(updateUser(payload));
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError ?? undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
