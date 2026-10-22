import React, { useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

export interface EggOption {
    id: number;
    name: string;
}

interface Props {
    eggs: EggOption[];
    value: number;
    currentEggId: number;
    disabled?: boolean;
    onChange: (eggId: number) => void;
}

const EggDropdown = ({ eggs, value, currentEggId, disabled, onChange }: Props) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const onDocumentClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', onDocumentClick);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onDocumentClick);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const selected = eggs.find((egg) => egg.id === value) || eggs[0];

    return (
        <div ref={ref} css={tw`relative flex-1`}>
            <button
                type={'button'}
                disabled={disabled}
                aria-haspopup={'listbox'}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                css={tw`w-full flex items-center justify-between gap-3 px-4 py-3 text-left font-bold text-sm cursor-pointer disabled:cursor-not-allowed`}
                style={{
                    backgroundColor: 'var(--bg-elevated)',
                    color: 'var(--text-main)',
                    border: '3px solid var(--border-color)',
                    borderRadius: '4px',
                    boxShadow: open ? 'var(--shadow-brutal)' : 'var(--shadow-brutal-sm)',
                    transform: open ? 'translate(-1px, -1px)' : undefined,
                    transition: 'box-shadow 120ms ease, transform 120ms ease',
                }}
            >
                <span css={tw`truncate`}>{selected?.name ?? 'Select egg'}</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    css={tw`text-xs flex-shrink-0`}
                    style={{
                        transform: open ? 'rotate(180deg)' : undefined,
                        transition: 'transform 150ms ease',
                    }}
                />
            </button>

            {open && (
                <ul
                    role={'listbox'}
                    css={tw`absolute z-50 w-full mt-2 overflow-hidden`}
                    style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '3px solid var(--border-color)',
                        borderRadius: '4px',
                        boxShadow: 'var(--shadow-brutal)',
                        maxHeight: '16rem',
                        overflowY: 'auto',
                    }}
                >
                    {eggs.map((egg) => {
                        const isSelected = egg.id === value;
                        const isCurrent = egg.id === currentEggId;

                        return (
                            <li key={egg.id} role={'option'} aria-selected={isSelected}>
                                <button
                                    type={'button'}
                                    onClick={() => {
                                        onChange(egg.id);
                                        setOpen(false);
                                    }}
                                    css={tw`w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold cursor-pointer`}
                                    style={{
                                        backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                                        color: isSelected ? 'var(--text-on-primary)' : 'var(--text-main)',
                                        transition: 'background-color 100ms ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-row-hover)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <span css={tw`flex items-center gap-2 truncate`}>
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            css={tw`text-xs flex-shrink-0`}
                                            style={{ opacity: isSelected ? 1 : 0 }}
                                        />
                                        <span css={tw`truncate`}>{egg.name}</span>
                                    </span>
                                    {isCurrent && (
                                        <span
                                            css={tw`text-xs uppercase tracking-wider px-2 py-0.5 flex-shrink-0`}
                                            style={{
                                                border: '2px solid var(--border-color)',
                                                borderRadius: '2px',
                                                color: 'var(--text-main)',
                                                backgroundColor: 'var(--bg-secondary)',
                                            }}
                                        >
                                            Current
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default EggDropdown;
