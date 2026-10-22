import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Form, Formik, Field as FormikField, FieldProps, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import login from '@/api/auth/login';
import Field from '@/components/elements/Field';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import Reaptcha from 'reaptcha';

interface Values {
    username: string;
    password: string;
    remember: boolean;
}

const LoginContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        login({ username: values.username, password: values.password, recaptchaData: token, remember: values.remember })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <main className={'brutal-auth-grid'}>
            <section className={'brutal-auth-brand'} aria-label={'Tentang panel'}>
                <span className={'tag'}>Game Server Panel</span>
                <h1>
                    Kontrol
                    <br />
                    <span>Servermu</span>
                </h1>
                <p>Start, stop, console, file manager, dan backup. Semua dalam satu panel yang tegas.</p>
                <div className={'brutal-auth-status'}>
                    <i className={'brutal-auth-dot'} /> Semua sistem online
                </div>
                <div className={'brutal-auth-stats'}>
                    <div>
                        <b>24/7</b>
                        <small>Uptime</small>
                    </div>
                    <div>
                        <b>99%</b>
                        <small>Stabil</small>
                    </div>
                    <div>
                        <b>SSL</b>
                        <small>Aman</small>
                    </div>
                </div>
            </section>

            <section className={'brutal-auth-card'} aria-labelledby={'login-title'}>
                <h2 id={'login-title'}>Login</h2>
                <p className={'sub'}>Masuk untuk lanjut ke dashboard.</p>
                <Formik
                    onSubmit={onSubmit}
                    initialValues={{ username: '', password: '', remember: true }}
                    validationSchema={object().shape({
                        username: string().required('Username atau email wajib diisi.'),
                        password: string().required('Password wajib diisi.'),
                    })}
                >
                    {({ isSubmitting, submitForm }) => (
                        <Form className={'brutal-auth-form'} noValidate>
                            <FlashMessageRender />
                            <Field
                                type={'text'}
                                label={'Username atau Email'}
                                name={'username'}
                                placeholder={'admin@contoh.com'}
                                autoComplete={'username'}
                                disabled={isSubmitting}
                            />
                            <FormikField name={'password'}>
                                {({ field, form: { errors, touched } }: FieldProps) => (
                                    <div>
                                        <Label htmlFor={'password'}>Password</Label>
                                        <div className={'brutal-auth-field'}>
                                            <Input
                                                id={'password'}
                                                {...field}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder={'••••••••'}
                                                autoComplete={'current-password'}
                                                disabled={isSubmitting}
                                                hasError={!!(touched.password && errors.password)}
                                                style={{ paddingRight: '84px' }}
                                            />
                                            <button
                                                type={'button'}
                                                className={'brutal-auth-eye'}
                                                onClick={() => setShowPassword((show) => !show)}
                                                aria-label={
                                                    showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                                                }
                                            >
                                                {showPassword ? 'Sembunyi' : 'Lihat'}
                                            </button>
                                        </div>
                                        {touched.password && errors.password && (
                                            <p className={'input-help error'}>{errors.password}</p>
                                        )}
                                    </div>
                                )}
                            </FormikField>
                            <div className={'brutal-auth-row'}>
                                {/* ponytail: backend always issues a remember cookie, so this is display-only. */}
                                <label className={'brutal-auth-check'}>
                                    <FormikField type={'checkbox'} name={'remember'} disabled={isSubmitting} />
                                    Ingat saya
                                </label>
                                <Link to={'/auth/password'} className={'brutal-auth-link'}>
                                    Lupa password?
                                </Link>
                            </div>
                            <button
                                type={'submit'}
                                className={'brutal-btn brutal-btn-primary brutal-auth-submit'}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Memproses...' : 'Login →'}
                            </button>
                            {recaptchaEnabled && (
                                <Reaptcha
                                    ref={ref}
                                    size={'invisible'}
                                    sitekey={siteKey || '_invalid_key'}
                                    onVerify={(response) => {
                                        setToken(response);
                                        submitForm();
                                    }}
                                    onExpire={() => {
                                        setToken('');
                                    }}
                                />
                            )}
                        </Form>
                    )}
                </Formik>
                <p className={'brutal-auth-note'}>
                    Belum punya akun?{' '}
                    <Link to={'/auth/register'} className={'brutal-auth-link'}>
                        Daftar
                    </Link>
                </p>
                <p className={'brutal-auth-note'}>Pterodactyl &copy; {new Date().getFullYear()}</p>
            </section>
        </main>
    );
};

export default LoginContainer;
