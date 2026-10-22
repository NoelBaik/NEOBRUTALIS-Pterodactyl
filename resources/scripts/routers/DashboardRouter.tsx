import React, { useEffect, useState } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import SubNavigation from '@/components/elements/SubNavigation';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import Alert from '@/components/elements/custom/Alert';
import styled from 'styled-components/macro';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';
import ContentContainer from '@/components/elements/ContentContainer';
import { NavigationRouter } from '@blueprint/extends/routers/DashboardRouter';
import CollapseBtn from '@/components/elements/custom/CollapseBtn';
import BeforeSubNavigation from '@blueprint/components/Navigation/SubNavigation/BeforeSubNavigation';
import AfterSubNavigation from '@blueprint/components/Navigation/SubNavigation/AfterSubNavigation';

const ContainerBlock = styled.div`
    display:flex;
    width:100%;

    & > .contentBlock{
        width:100%;
    }
    @media only screen and (max-width:979px){
      &{
          display:block;
      }
      & .collapseBtn{
          display:none;
      }
    }
`;

export default () => {
    return (
        <ContainerBlock>
            <>
                <NavigationBar />
                <div className='contentBlock'>
                <ContentContainer>
                    <SubNavigation>
                        <BeforeSubNavigation />
                        <div>
                            <div className='collapseBtn'>
                                <CollapseBtn/>
                            </div>
                            <SearchContainer/>
                        </div>
                        <AfterSubNavigation />
                        </SubNavigation>
                        <Alert/>
                </ContentContainer>
                <NavigationRouter />
                </div>
            </>
        </ContainerBlock>
    );
};
