import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div.attrs({
    className: 'brutal-subnav-drawer',
})`
    ${tw`w-full overflow-x-auto mb-6`};
    background-color: var(--bg-secondary);
    border-bottom: 3px solid var(--border-color);

    & > div {
        ${tw`flex items-center gap-2 text-sm py-2.5`};
        width: 100%;
        max-width: none;
        margin: 0;
        padding-left: 0;
        padding-right: 0;

        /* ponytail: keep one horizontal scrollable row on phones (column stack cut off nav items) */
        @media (max-width: 979px) {
            ${tw`overflow-x-auto`};
        }

        & > a,
        & > div {
            ${tw`inline-block py-2 px-4 font-extrabold uppercase no-underline whitespace-nowrap transition-all duration-100`};
            color: var(--text-main);
            background-color: var(--bg-elevated);
            border: 3px solid var(--border-color);
            border-radius: 4px;
            box-shadow: 2px 2px 0px var(--shadow-color);

            &:hover {
                transform: translate(-2px, -2px);
                box-shadow: 4px 4px 0px var(--shadow-color);
                background-color: var(--bg-row-hover);
            }

            &:active,
            &.active {
                background-color: var(--color-primary) !important;
                color: #000000 !important;
                box-shadow: 3px 3px 0px var(--shadow-color) !important;
            }
        }
    }
`;

export default SubNavigation;
