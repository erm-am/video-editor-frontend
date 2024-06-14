import React from 'react';

import styled from '@emotion/styled';
import { Paths } from '@/router/paths';
import { NavLink } from 'react-router-dom';

export const SidebarMenu = () => {
  return (
    <SidebarMenuContainer>
      <StyledLink to={Paths.MAIN} end>
        <Image>...</Image>
        <Label>Медиа</Label>
      </StyledLink>
      <StyledLink to={Paths.RESULT}>
        <Image>...</Image>
        <Label>Результат</Label>
      </StyledLink>
    </SidebarMenuContainer>
  );
};

const SidebarMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid red;
  gap: 10px;
`;

export const Image = styled.div``;
export const Label = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
`;
export const StyledLink = styled(NavLink)`
  background-color: gray;
  padding: 16px 24px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  text-decoration: none;
  color: var(--neutral-color-400);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  height: 50px;
  width: 100%;
  border-radius: 6px;
`;
