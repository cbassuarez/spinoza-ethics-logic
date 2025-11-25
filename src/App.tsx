import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CorpusPage from './pages/CorpusPage';
import PartPage from './pages/PartPage';
import EthicsItemPage from './pages/EthicsItemPage';
import GraphPage from './pages/GraphPage';
import SearchPage from './pages/SearchPage';
import LogicDocsPage from './pages/LogicDocsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/corpus" element={<CorpusPage />} />
        <Route path="/ethics/part/:partNumber" element={<PartPage />} />
        <Route path="/ethics/:id" element={<EthicsItemPage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/logic" element={<LogicDocsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
