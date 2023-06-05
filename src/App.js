import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProdutoPage from "./pages/ProdutoPage";
import { CategoriaPage } from "./pages/categoria";
import HomePage from "./pages/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categoria/:categorias_id" element={<CategoriaPage />} />
        <Route path="/produto/:id" element={<ProdutoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
