import http from '@/api/http';

export default (uuid: string, eggId: number, reinstall: boolean): Promise<void> =>
    new Promise((resolve, reject) => {
        http.put(`/api/client/servers/${uuid}/startup/egg`, { egg_id: eggId, reinstall })
            .then(() => resolve())
            .catch(reject);
    });
