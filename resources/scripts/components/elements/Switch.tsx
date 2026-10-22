import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';

const ToggleContainer = styled.div`
    ${tw`relative select-none w-14 leading-normal`};

    & > input[type='checkbox'] {
        ${tw`hidden`};

        &:checked + label {
            background-color: var(--color-primary);
        }

        &:checked + label:before {
            right: 4px;
            background-color: #000000;
        }
    }

    & > label {
        ${tw`block overflow-hidden cursor-pointer h-7 transition-all duration-100`};
        background-color: var(--bg-elevated);
        border: 3px solid var(--border-color);
        border-radius: 2px;
        box-shadow: 2px 2px 0px var(--shadow-color);

        &::before {
            content: '';
            ${tw`block absolute w-4 h-4 transition-all duration-100`};
            top: 5px;
            right: calc(100% - 22px);
            background-color: var(--text-main);
            border: 2px solid var(--border-color);
        }
    }
`;

export interface SwitchProps {
    name: string;
    label?: string;
    description?: string;
    defaultChecked?: boolean;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
}

const Switch = ({ name, label, description, defaultChecked, readOnly, onChange, children }: SwitchProps) => {
    const uuid = useMemo(() => v4(), []);

    return (
        <div css={tw`flex items-center`}>
            <ToggleContainer css={tw`flex-none`}>
                {children || (
                    <Input
                        id={uuid}
                        name={name}
                        type={'checkbox'}
                        onChange={(e) => onChange && onChange(e)}
                        defaultChecked={defaultChecked}
                        disabled={readOnly}
                    />
                )}
                <Label htmlFor={uuid} />
            </ToggleContainer>
            {(label || description) && (
                <div css={tw`ml-4 w-full`}>
                    {label && (
                        <Label css={[tw`cursor-pointer mb-0 font-extrabold uppercase`, !!description && tw`mb-1`]} htmlFor={uuid}>
                            {label}
                        </Label>
                    )}
                    {description && <p css={tw`text-sm font-medium opacity-80`}>{description}</p>}
                </div>
            )}
        </div>
    );
};

export default Switch;
