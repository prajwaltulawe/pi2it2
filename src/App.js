import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <div className="container m-auto">
                <Routes>
                  <Route exact path="/" element={<Home /> } />
                  <Route exact path="/login" element={<Login />} />
                  <Route exact path="/signup" element={<Signup />} />
                </Routes>
            </div>
        </BrowserRouter>
      </QueryClientProvider> 
    </>
  );
}

export default App;
