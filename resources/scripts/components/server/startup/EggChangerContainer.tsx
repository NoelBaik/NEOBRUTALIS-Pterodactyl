import React from 'react';
import tw from 'twin.macro';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import Spinner from '@/components/elements/Spinner';
import { ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import getServerStartup from '@/api/swr/getServerStartup';
import EggSwitcher from '@/components/server/startup/EggSwitcher';

const EggChangerContainer = () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { data, error, isValidating, mutate } = getServerStartup(uuid);

    if (!data) {
        return error && !isValidating ? (
            <ServerError title={'Oops!'} message={httpErrorToHuman(error)} onRetry={() => mutate()} />
        ) : (
            <Spinner centered size={Spinner.Size.LARGE} />
        );
    }

    const eggs = data.switchableEggs || [];

    return (
        <ServerContentBlock title={'Egg Changer'} showFlashKey={'startup:egg'}>
            {eggs.length > 1 ? (
                <EggSwitcher eggs={eggs} currentEggId={data.currentEggId ?? 0} />
            ) : (
                <p css={tw`text-sm text-neutral-300`}>
                    This server cannot be switched to another egg. Contact an administrator if you need a different
                    egg.
                </p>
            )}
        </ServerContentBlock>
    );
};

export default EggChangerContainer;
