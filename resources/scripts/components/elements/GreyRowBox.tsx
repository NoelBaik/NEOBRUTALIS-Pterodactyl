import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded items-center no-underline p-4 transition-all duration-100`};
    background-color: var(--bg-secondary);
    color: var(--text-main);
    border: 3px solid var(--border-color);
    border-radius: 4px;
    box-shadow: var(--shadow-brutal);

    ${(props) =>
        props.$hoverable !== false &&
        `
        &:hover {
            transform: translate(-2px, -2px);
            box-shadow: var(--shadow-brutal-hover);
            background-color: var(--bg-row-hover);
        }
    `};

    & .icon {
        ${tw`w-10 h-10 flex items-center justify-center p-2`};
        background-color: var(--color-primary);
        border: 2px solid var(--border-color);
        color: #000000;
    }
`;
