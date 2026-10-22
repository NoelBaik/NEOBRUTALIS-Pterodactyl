import styled from 'styled-components/macro';

const Label = styled.label<{ isLight?: boolean }>`
    display: block;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-main);
    margin-bottom: 0.35rem;

    @media (min-width: 640px) {
        margin-bottom: 0.5rem;
    }
`;

export default Label;
