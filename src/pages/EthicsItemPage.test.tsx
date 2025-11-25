import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import EthicsItemPage from './EthicsItemPage';
import { corpus } from '../data';

const sampleId = corpus[0].id;

describe('EthicsItemPage', () => {
  it('renders known item content', () => {
    render(
      <MemoryRouter initialEntries={[`/ethics/${sampleId}`]}>
        <Routes>
          <Route path="/ethics/:id" element={<EthicsItemPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(corpus[0].label)).toBeInTheDocument();
    expect(screen.getByText(corpus[0].text.translation)).toBeInTheDocument();
  });
});
