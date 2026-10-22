import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
}

const inputStyle = css<Props>`
    ${tw`w-full px-3.5 py-2.5 text-sm font-semibold transition-all duration-100 outline-none`};
    background-color: var(--bg-elevated);
    color: var(--text-main);
    border: 3px solid var(--border-color);
    border-radius: 4px;
    box-shadow: var(--shadow-brutal-sm);

    &:hover:not(:disabled):not(:read-only) {
        box-shadow: var(--shadow-brutal);
    }

    &:focus {
        background-color: var(--bg-secondary);
        box-shadow: var(--shadow-brutal);
        transform: translate(-1px, -1px);
    }

    &:disabled,
    &:read-only {
        ${tw`opacity-60 cursor-not-allowed`};
        box-shadow: none;
    }

    ${(props) =>
        props.hasError &&
        css`
            border-color: var(--color-danger) !important;
            background-color: #FEF2F2 !important;
            box-shadow: 4px 4px 0px var(--color-danger) !important;
        `};
`;

const Input = styled.input<Props>`
    &:not([type='checkbox']):not([type='radio']) {
        ${inputStyle};
    }

    &[type='checkbox'],
    &[type='radio'] {
        ${tw`inline-grid place-content-center cursor-pointer`};
        width: 22px;
        height: 22px;
        background-color: var(--bg-elevated);
        border: 3px solid var(--border-color);
        border-radius: 2px;
        box-shadow: 2px 2px 0px var(--shadow-color);
        appearance: none;

        &:checked {
            background-color: var(--color-primary);
        }
    }
`;

export const Textarea = styled.textarea<Props>`
    ${inputStyle};
`;

export default Input;
