import './App.css';
import Beer from './../Beer/Beer'
import {MetaDataProvider} from "../../Context/MetaDataContext"
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
        <MetaDataProvider>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Beer />
          </Container>
        </MetaDataProvider>
      </Box>
    </div>
  );
}

export default App;
