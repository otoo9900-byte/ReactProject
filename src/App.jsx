import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MealProvider } from './context/MealContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Planner from './pages/Planner';
import Shopping from './pages/Shopping';
import Recipes from './pages/Recipes';

function App() {
  return (
    <MealProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="planner" element={<Planner />} />
            <Route path="shopping" element={<Shopping />} />
            <Route path="recipes" element={<Recipes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MealProvider>
  );
}

export default App;
