import React from 'react';
import { useDataStore, useThemeStore } from './app/store';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { Header, MainContent, Sidebar } from './components';

const App = () => {
  const theme = useThemeStore(state => state.theme);
  const { isSidebarOpen } = useDataStore();

  return (
    <ThemeProvider theme={theme}>
      <Wrapper isOpen={isSidebarOpen}>
        {isSidebarOpen && <Sidebar />}
        <Container isOpen={isSidebarOpen}>
          <Header />
          <MainContent />
        </Container>
      </Wrapper>
    </ThemeProvider>
  );
};

const Container = styled.div<{
  isOpen: boolean;
}>`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;

  position: absolute;
  left: ${({ isOpen }) => (isOpen ? '250px' : '0')};
  transition: all 0.3s ease-in-out;
`;

const Wrapper = styled.div<{
  isOpen: boolean;
}>`
  display: flex;
  background-color: ${({ theme }) => theme.body};

  position: relative;
  height: 100vh;
  min-height: 100vh;

  /* overflow: ${({ isOpen }) => (isOpen ? 'hidden' : 'auto')}; */

  overflow: hidden;
`;

export default App;
