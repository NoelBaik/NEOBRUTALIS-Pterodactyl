import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Form, Formik, FormikHelpers } from 'formik';
import { object, ref, string } from 'yup';
import register, { requestOtp } from '@/api/auth/register';
import Field from '@/components/elements/Field';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import Reaptcha from 'reaptcha';

interface Values {
    name: string;
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    code: string;
}

const RegisterContainer = ({ history }: RouteComponentProps) => {
    const captchaRef = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [resendIn, setResendIn] = useState(0);

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    useEffect(() => {
        if (resendIn <= 0) return;

        const timer = setTimeout(() => setResendIn(resendIn - 1), 1000);

        return () => clearTimeout(timer);
    }, [resendIn]);

    const sendCode = (values: Values, setSubmitting: (value: boolean) => void) => {
        clearFlashes();
        setSubmitting(true);

        requestOtp(values)
            .then(() => {
                setCodeSent(true);
                setResendIn(60);
            })
            .catch(clearAndAddHttpError)
            .finally(() => setSubmitting(false));
    };

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        if (!codeSent) {
            sendCode(values, setSubmitting);

            return;
        }

        if (recaptchaEnabled && !token) {
            captchaRef.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        register({ ...values, recaptchaData: token })
            .then((response) => {
                // @ts-expect-error this is valid
                window.location = response.intended || '/';
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (captchaRef.current) captchaRef.current.reset();

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <main className={'brutal-auth-grid'}>
            <section className={'brutal-auth-brand'} aria-label={'Tentang panel'}>
                <span className={'tag'}>Game Server Panel</span>
                <h1>
                    Mulai
                    <br />
                    <span>Gratis</span>
                </h1>
                <p>Buat akun, kelola server, dan pantau semuanya dari satu dashboard.</p>
                <div className={'brutal-auth-status'}>
                    <i className={'brutal-auth-dot'} /> Pendaftaran terbuka
                </div>
                <div className={'brutal-auth-stats'}>
                    <div>
                        <b>0 Rp</b>
                        <small>Daftar</small>
                    </div>
                    <div>
                        <b>3 dtk</b>
                        <small>Proses</small>
                    </div>
                    <div>
                        <b>SSL</b>
                        <small>Aman</small>
                    </div>
                </div>
            </section>

            <section className={'brutal-auth-card'} aria-labelledby={'register-title'}>
                <h2 id={'register-title'}>{codeSent ? 'Verifikasi Email' : 'Register'}</h2>
                <p className={'sub'}>
                    {codeSent
                        ? 'Masukkan 6 digit kode yang kami kirim ke email Anda.'
                        : 'Isi data di bawah untuk membuat akun.'}
                </p>
                <Formik
                    onSubmit={onSubmit}
                    initialValues={{
                        name: '',
                        username: '',
                        email: '',
                        password: '',
                        passwordConfirmation: '',
                        code: '',
                    }}
                    validationSchema={object().shape({
                        name: string().max(191, 'Nama maksimal 191 karakter.'),
                        username: string()
                            .required('Username wajib diisi.')
                            .min(3, 'Username minimal 3 karakter.')
                            .matches(
                                /^[a-z0-9]([\w.-]+)[a-z0-9]$/i,
                                'Hanya huruf, angka, titik, strip, dan garis bawah. Diawali dan diakhiri huruf/angka.'
                            ),
                        email: string().email('Format email tidak valid.').required('Email wajib diisi.'),
                        password: string().min(8, 'Password minimal 8 karakter.').required('Password wajib diisi.'),
                        passwordConfirmation: string()
                            .oneOf([ref('password'), undefined], 'Konfirmasi password tidak cocok.')
                            .required('Konfirmasi password wajib diisi.'),
                        code: codeSent
                            ? string()
                                  .matches(/^\d{6}$/, 'Kode harus 6 digit angka.')
                                  .required('Kode verifikasi wajib diisi.')
                            : string(),
                    })}
                >
                    {({ isSubmitting, submitForm, values }) => (
                        <Form className={'brutal-auth-form'} noValidate>
                            <FlashMessageRender />
                            {!codeSent ? (
                                <>
                                    <Field
                                        type={'text'}
                                        label={'Nama (opsional)'}
                                        name={'name'}
                                        placeholder={'Budi Santoso'}
                                        autoComplete={'name'}
                                        disabled={isSubmitting}
                                    />
                                    <Field
                                        type={'text'}
                                        label={'Username'}
                                        name={'username'}
                                        placeholder={'budi'}
                                        autoComplete={'username'}
                                        disabled={isSubmitting}
                                    />
                                    <Field
                                        type={'email'}
                                        label={'Email'}
                                        name={'email'}
                                        placeholder={'budi@contoh.com'}
                                        autoComplete={'email'}
                                        disabled={isSubmitting}
                                    />
                                    <Field
                                        type={'password'}
                                        label={'Password'}
                                        name={'password'}
                                        placeholder={'••••••••'}
                                        autoComplete={'new-password'}
                                        disabled={isSubmitting}
                                    />
                                    <Field
                                        type={'password'}
                                        label={'Konfirmasi Password'}
                                        name={'passwordConfirmation'}
                                        placeholder={'••••••••'}
                                        autoComplete={'new-password'}
                                        disabled={isSubmitting}
                                    />
                                </>
                            ) : (
                                <>
                                    <Field
                                        type={'text'}
                                        label={'Kode Verifikasi'}
                                        name={'code'}
                                        placeholder={'123456'}
                                        autoComplete={'one-time-code'}
                                        inputMode={'numeric'}
                                        maxLength={6}
                                        disabled={isSubmitting}
                                    />
                                    <p className={'brutal-auth-note'}>
                                        Kode dikirim ke <b>{values.email}</b>
                                    </p>
                                </>
                            )}
                            <button
                                type={'submit'}
                                className={'brutal-btn brutal-btn-primary brutal-auth-submit'}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Memproses...'
                                    : codeSent
                                      ? 'Verifikasi & Buat Akun →'
                                      : 'Kirim Kode Verifikasi →'}
                            </button>
                            {codeSent && (
                                <button
                                    type={'button'}
                                    className={'brutal-btn brutal-btn-secondary brutal-auth-submit'}
                                    disabled={isSubmitting || resendIn > 0}
                                    onClick={() => sendCode(values, () => undefined)}
                                >
                                    {resendIn > 0 ? `Kirim ulang dalam ${resendIn} dtk` : 'Kirim Ulang Kode'}
                                </button>
                            )}
                            {recaptchaEnabled && (
                                <Reaptcha
                                    ref={captchaRef}
                                    size={'invisible'}
                                    sitekey={siteKey || '_invalid_key'}
                                    onVerify={(response) => {
                                        setToken(response);
                                        submitForm();
                                    }}
                                    onExpire={() => setToken('')}
                                />
                            )}
                        </Form>
                    )}
                </Formik>
                <p className={'brutal-auth-note'}>
                    Sudah punya akun?{' '}
                    <Link to={'/auth/login'} className={'brutal-auth-link'}>
                        Login
                    </Link>
                </p>
            </section>
        </main>
    );
};

export default RegisterContainer;
