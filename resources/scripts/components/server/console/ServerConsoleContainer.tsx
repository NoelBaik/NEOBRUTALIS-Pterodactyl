import React, { memo, useEffect } from 'react';
import { ServerContext } from '@/state/server';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import TopElement from '@/components/server/console/TopElement';
import StatStrip from '@/components/server/console/StatStrip';
import { Alert } from '@/components/elements/alert';
import { Server_is_transferred, Server_is_installing, Node_is_maintenance } from '@/lang';
import BeforeContent from '@blueprint/components/Server/Terminal/BeforeContent';
import AfterContent from '@blueprint/components/Server/Terminal/AfterContent';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ServerConsoleContainer = () => {
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);

    return (
        <ServerContentBlock title={'Console'}>
            <BeforeContent />
            <TopElement />
            <StatStrip />
            <Spinner.Suspense>
                <Console />
            </Spinner.Suspense>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className='mt-3'>
                    {isNodeUnderMaintenance
                        ? `${Node_is_maintenance}`
                        : isInstalling
                        ? `${Server_is_installing}`
                        : `${Server_is_transferred}`}
                </Alert>
            )}
            <AfterContent />
            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
