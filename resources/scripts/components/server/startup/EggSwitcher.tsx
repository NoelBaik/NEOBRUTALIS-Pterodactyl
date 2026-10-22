import React, { useState } from 'react';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/elements/Button';
import EggDropdown from '@/components/server/startup/EggDropdown';
import { ServerContext } from '@/state/server';
import { useFlashKey } from '@/plugins/useFlash';
import switchServerEgg from '@/api/server/switchServerEgg';

interface Props {
    eggs: { id: number; name: string }[];
    currentEggId: number;
}

const EggSwitcher = ({ eggs, currentEggId }: Props) => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { clearFlashes, clearAndAddHttpError } = useFlashKey('startup:egg');

    const [eggId, setEggId] = useState(currentEggId);
    const [reinstall, setReinstall] = useState(true);
    const [loading, setLoading] = useState(false);

    const current = eggs.find((egg) => egg.id === currentEggId);
    const selected = eggs.find((egg) => egg.id === eggId);
    const changed = eggId !== currentEggId;

    const submit = () => {
        if (!changed) return;

        setLoading(true);
        clearFlashes();

        switchServerEgg(uuid, eggId, reinstall)
            .then(() => window.location.reload())
            .catch((error) => {
                console.error(error);
                clearAndAddHttpError(error);
                setLoading(false);
            });
    };

    return (
        <div className={'brutal-card'} css={tw`p-5 md:p-6`}>
            <h3 className={'brutal-heading'} css={tw`text-sm uppercase tracking-wider font-black mb-1`}>
                Egg / Nest
            </h3>
            <p css={tw`text-xs mb-5`} style={{ color: 'var(--text-muted)' }}>
                Switch this server to a different egg. All startup variables are reset to the new {"egg's"} defaults.
            </p>

            <div css={tw`flex flex-col md:flex-row md:items-end gap-4`}>
                <div css={tw`flex-1`}>
                    <label css={tw`block text-xs uppercase tracking-wider font-black mb-2`}>New egg</label>
                    <EggDropdown eggs={eggs} value={eggId} currentEggId={currentEggId} onChange={setEggId} />
                </div>

                <div css={tw`flex flex-col justify-end`}>
                    <span css={tw`block text-xs uppercase tracking-wider font-black mb-2`}>Options</span>
                    <label
                        css={tw`flex items-center gap-2 px-4 py-3 text-sm font-bold cursor-pointer select-none`}
                        style={{
                            border: '3px solid var(--border-color)',
                            borderRadius: '4px',
                            backgroundColor: reinstall ? 'var(--bg-row-hover)' : 'var(--bg-elevated)',
                            boxShadow: 'var(--shadow-brutal-sm)',
                            transition: 'background-color 120ms ease',
                        }}
                    >
                        <input
                            type={'checkbox'}
                            checked={reinstall}
                            onChange={(e) => setReinstall(e.currentTarget.checked)}
                            css={tw`w-4 h-4 cursor-pointer`}
                            style={{ accentColor: 'var(--color-primary)' }}
                        />
                        Reinstall after switch
                    </label>
                </div>
            </div>

            {changed && (
                <div
                    css={tw`mt-5 p-4 flex items-start gap-3 text-sm`}
                    style={{
                        border: '3px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-row-hover)',
                        boxShadow: 'var(--shadow-brutal-sm)',
                    }}
                >
                    <FontAwesomeIcon icon={faExclamationTriangle} css={tw`mt-0.5 flex-shrink-0`} />
                    <div>
                        <p css={tw`font-black`}>Switching from {current?.name} to {selected?.name}</p>
                        <p css={tw`text-xs mt-1`} style={{ color: 'var(--text-muted)' }}>
                            {reinstall
                                ? 'The install script of the new egg will run and may overwrite existing files.'
                                : 'The install script will not run. You may need to install dependencies manually.'}
                        </p>
                    </div>
                </div>
            )}

            <div css={tw`mt-5 flex items-center gap-3`}>
                <Button type={'button'} isLoading={loading} disabled={!changed} onClick={submit}>
                    <FontAwesomeIcon icon={faSyncAlt} css={tw`mr-2`} />
                    Switch egg
                </Button>
                {changed && (
                    <button
                        type={'button'}
                        css={tw`px-4 py-2 text-sm font-bold cursor-pointer`}
                        style={{
                            border: '3px solid var(--border-color)',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-elevated)',
                            color: 'var(--text-main)',
                            boxShadow: 'var(--shadow-brutal-sm)',
                        }}
                        onClick={() => setEggId(currentEggId)}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default EggSwitcher;
