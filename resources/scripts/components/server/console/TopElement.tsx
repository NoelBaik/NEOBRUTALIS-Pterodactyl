import React from 'react';
import { ServerContext } from '@/state/server';
import styled from 'styled-components/macro';
import CopyOnClick from '@/components/elements/CopyOnClick';
import PowerButtons from '@/components/server/console/PowerButtons';
import { ip } from '@/lib/formatters';
import BlurredText from '@/components/elements/BlurredText';
import * as Icon from 'react-feather';

const Head = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;

    h1 {
        margin: 0;
        font-family: var(--font-heading) !important;
        font-size: clamp(22px, 3vw, 32px);
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: -1px;
        word-break: break-word;
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
        font-weight: 700;
        font-size: 14px;
    }

    .addr {
        font-family: var(--font-mono);
        background-color: var(--bg-main);
        border: 3px solid var(--border-color);
        box-shadow: 2px 2px 0 var(--shadow-color);
        padding: 2px 8px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 3px solid var(--border-color);
        box-shadow: 2px 2px 0 var(--shadow-color);
        padding: 2px 10px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        background-color: var(--color-warning);
        color: #000000;
    }

    .pill.running {
        background-color: var(--color-success);
    }
    .pill.offline {
        background-color: var(--color-danger);
    }

    .power {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        min-width: 0;

        & > button {
            min-width: 92px;
        }
    }

    @media (max-width: 640px) {
        .power {
            width: 100%;
            flex-wrap: nowrap;
        }
        .power > button {
            flex: 1 1 0;
            min-width: 0;
            padding-left: 8px;
            padding-right: 8px;
        }
    }
`;

const TopElement = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const node = ServerContext.useStoreState((state) => state.server.data!.node);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data!.allocations.find((allocation) => allocation.isDefault);

        return !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    });

    const label = status === 'running' ? 'Running' : status === 'offline' ? 'Offline' : 'Starting';
    const stateClass = status === 'running' ? 'running' : status === 'offline' ? 'offline' : '';

    return (
        <Head>
            <div>
                <h1>{name}</h1>
                <div className={'meta'}>
                    <span className={`pill ${stateClass}`}>
                        <Icon.Radio size={14} />
                        {label}
                    </span>
                    <CopyOnClick text={allocation}>
                        <span className={'addr'}>
                            <Icon.Globe size={14} />
                            <BlurredText>{allocation}</BlurredText>
                        </span>
                    </CopyOnClick>
                    <CopyOnClick text={id}>
                        <span className={'addr'}>
                            <Icon.Hash size={14} />
                            {id}
                        </span>
                    </CopyOnClick>
                    <span className={'addr'}>
                        <Icon.Server size={14} />
                        {node}
                    </span>
                </div>
            </div>
            <PowerButtons className={'power'} />
        </Head>
    );
};

export default TopElement;
