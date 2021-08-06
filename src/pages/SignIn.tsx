import { FC, ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { Redirect, Link as RouteLink, RouteComponentProps, withRouter } from 'react-router-dom';

interface POST_ApiAuthLogin {
  email: string;
  password: string;
  passwordConfirmation?: string;
  rememberMe?: boolean;
}

export enum AuthEnum {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

enum INPUT {
  email = 'email',
  password = 'password',
  passwordConfirm = 'passwordConfirm',
  rememberMe = 'rememberMe',
}
const PASSWORD_MIN_LENGTH = 6;

const SignIn: FC<{ type: AuthEnum } & RouteComponentProps> = ({ type, location }) => {
  const [fields, setFields] = useState<POST_ApiAuthLogin>({
    email: '',
    password: '',
    passwordConfirmation: '',
    rememberMe: true,
  });
  const [errors, setErrors] = useState<any>({});
  const [redirect, setRedirect] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isSignBtnDisabled, setIsSignBtnDisabled] = useState<boolean>(true);
  const [urlToRedirect, setUrlToRedirect] = useState<string>('');

  const attempt = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      // await axios().post(`api/auth${url}`, requestBody)
      // const response: AxiosResponse<GET200_User> = await axios().get(GET_USER_URL)
      // const user = response.data.user
      // if (user) {
      //   setUser(user)
      // }
      setRedirect(true);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };
  const checkPaswordsMatching = (password: string, confirmation: string): void => {
    const errTxt = password !== confirmation ? 'Password Not Match' : null;
    setErrors({ ...errors, password: errTxt, passwordConfirmation: errTxt });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const { id, value } = e.target;
    setErrors({ ...errors, [id]: null, custom: null });
    if (id === INPUT.email) {
      setFields((prev: POST_ApiAuthLogin) => ({ ...prev, email: value }));
      return;
    }
    if (id === INPUT.rememberMe) {
      setFields((prev: POST_ApiAuthLogin) => ({ ...prev, rememberMe: !fields.rememberMe }));
      return;
    }

    if ([INPUT.password, INPUT.passwordConfirm].includes(id as INPUT)) {
      setFields((prev: POST_ApiAuthLogin) => ({ ...prev, [id]: value as string }));

      if (type === AuthEnum.REGISTER) {
        const firstVal = id === INPUT.password ? value : fields.password;
        const secondVal = id === INPUT.passwordConfirm ? value : fields?.passwordConfirmation;
        checkPaswordsMatching(firstVal, secondVal || '');
      }
      setErrors((prev: any) => ({
        ...prev,
        [id]: value.length <= PASSWORD_MIN_LENGTH && value ? 'pswd Length Validation Failed' : null,
      }));

      setFields({ ...fields, [id]: value as string });
      return;
    }
  };

  return (
    <>
      {redirect ? (
        <Redirect push to='/' />
      ) : (
        <div>
          <form onSubmit={attempt} noValidate={false}>
            <label>
              Email
              <input
                id={INPUT.email}
                value={fields.email ? fields.email : ''}
                onChange={handleChange}
                name='email'
                type='email'
                autoFocus
                disabled={isLoading}
              />
              {errors.email ? <p>{errors.email}</p> : null}
            </label>

            <label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                value={fields?.password || ''}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button type='button' onClick={() => setIsShowPassword(!isShowPassword)}>
                {isShowPassword ? 'Hide' : 'Show'}
              </button>
            </label>

            <div style={{ position: 'relative' }}>
              <button type='submit' disabled={isSignBtnDisabled}>
                {type === AuthEnum.LOGIN ? 'sign in' : 'register'}
              </button>

              {isLoading ? <span>Request ongoin</span> : null}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default withRouter(SignIn);
