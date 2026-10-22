import styled from 'styled-components/macro';

// Gutter between sidebar and page content on every page.
const ContentContainer = styled.div`
    width: 100%;
    padding-left: clamp(12px, 2vw, 28px);
    padding-right: clamp(12px, 2vw, 28px);

    @media (max-width: 979px) {
        padding-left: 14px;
        padding-right: 14px;
    }
`;
ContentContainer.displayName = 'ContentContainer';

export default ContentContainer;
