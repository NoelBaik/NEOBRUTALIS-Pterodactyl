import http from '@/api/http';

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    name?: string;
    code: string;
    recaptchaData?: string | null;
}

export const requestOtp = (data: Omit<RegisterData, 'code' | 'recaptchaData'>): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.get('/sanctum/csrf-cookie')
            .then(() =>
                http.post('/auth/register/otp', {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.passwordConfirmation,
                    name: data.name,
                })
            )
            .then(() => resolve())
            .catch(reject);
    });
};

export default (data: RegisterData): Promise<{ complete: boolean; intended?: string }> => {
    return new Promise((resolve, reject) => {
        http.get('/sanctum/csrf-cookie')
            .then(() =>
                http.post('/auth/register', {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.passwordConfirmation,
                    name: data.name,
                    code: data.code,
                    'g-recaptcha-response': data.recaptchaData,
                })
            )
            .then((response) => {
                if (!(response.data instanceof Object)) {
                    return reject(new Error('An error occurred while processing the registration request.'));
                }

                return resolve({
                    complete: response.data.data.complete,
                    intended: response.data.data.intended || undefined,
                });
            })
            .catch(reject);
    });
};
