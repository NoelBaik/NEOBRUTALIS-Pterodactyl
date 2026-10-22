import React from 'react';
import styled from 'styled-components/macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';

const Card = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 -14px;
    padding: 12px 14px;
    border-top: 3px solid var(--border-color);
    background-color: var(--bg-secondary);

    .avatar {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        display: grid;
        place-content: center;
        background-color: var(--color-primary);
        border: 3px solid var(--border-color);
        font-family: var(--font-heading);
        font-size: 18px;
        color: #000000;
    }

    .who {
        min-width: 0;
    }

    b {
        display: block;
        font-size: 14px;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    small {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--text-muted);
    }

    @media (max-width: 979px) {
        margin: 0 -10px;
    }
`;

export default () => {
    const username = useStoreState((state: ApplicationStore) => state.user.data?.username);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data?.rootAdmin);

    return (
        <Card>
            <div className={'avatar'}>{(username || '?').charAt(0).toUpperCase()}</div>
            <div className={'who'}>
                <b>{username || 'User'}</b>
                <small>{rootAdmin ? 'Administrator' : 'Client'}</small>
            </div>
        </Card>
    );
};
