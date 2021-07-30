import './App.css';
import Beer from './../Beer/Beer'
import { Box, Container } from '@material-ui/core';

function App() {
  return (
    <div className="App">
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Beer />
        </Container>
      </Box>
    </div>
  );
}

export default App;
