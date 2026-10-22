import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

interface Props {
    hideDropdownArrow?: boolean;
}

const Select = styled.select<Props>`
    ${tw`w-full px-3.5 py-2.5 pr-9 text-sm font-bold outline-none cursor-pointer transition-all duration-100`};
    background-color: var(--bg-elevated);
    color: var(--text-main);
    border: 3px solid var(--border-color);
    border-radius: 4px;
    box-shadow: var(--shadow-brutal-sm);
    appearance: none;

    &:hover:not(:disabled) {
        box-shadow: var(--shadow-brutal);
        transform: translate(-1px, -1px);
    }

    &:focus {
        background-color: var(--bg-secondary);
        box-shadow: var(--shadow-brutal);
    }

    ${(props) =>
        !props.hideDropdownArrow &&
        css`
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='black'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.65rem center;
            background-size: 1.25rem;
        `};
`;

export default Select;
