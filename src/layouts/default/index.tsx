import React from 'react';
import styled from '@emotion/styled';

export const DefaultLayout = ({ children }) => {
  return (
    <Page>
      <Header />
      <Container>
        <Sidebar></Sidebar>
        <Content>{children}</Content>
      </Container>
    </Page>
  );
};

export const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 80px;
  height: 80px;
  width: 100%;
  padding: 20px;
  border: 1px solid black;
`;

export const Sidebar = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-basis: 80px;
  align-self: flex-start;
  border: 1px solid black;
`;

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  min-height: 0;
  min-width: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 20px;
  border: 1px solid black;
`;
