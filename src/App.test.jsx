import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fixture } from './test/fixture.js';
import { renderApp } from './test/render.jsx';

vi.mock('./data/photos.generated.json', async () => ({ default: (await import('./test/fixture.js')).fixture }));

describe('routing', () => {
  it('renders the home page with work and latest trips', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/physics and math student/i);
    expect(screen.getByRole('link', { name: /AIS Forecaster/ })).toHaveAttribute('href', expect.stringContaining('github.com'));
    expect(screen.getByRole('link', { name: /New Trip/ })).toHaveAttribute('href', '/plog/new-trip');
    expect(screen.queryByText('Draft Trip')).not.toBeInTheDocument();
  });

  it('deep-links to a trip', () => {
    renderApp('/plog/new-trip');
    expect(screen.getByRole('heading', { level: 1, name: 'New Trip' })).toBeInTheDocument();
    expect(screen.getByText('Fresh story.')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /alt new-trip/ })).toHaveLength(2);
    expect(document.title).toBe('New Trip — Axel Friberg Hagen');
  });

  it('shows 404 for drafts and unknown trips', () => {
    renderApp('/plog/draft-trip');
    expect(screen.getByText('404')).toBeInTheDocument();
    renderApp('/nope');
    expect(screen.getAllByText('Lost the trail.').length).toBeGreaterThan(0);
  });

  it('renders Norwegian copy and trip titles', () => {
    renderApp('/plog', { lang: 'no' });
    expect(screen.getByRole('link', { name: /Ny tur/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Turer' })).toBeInTheDocument();
  });
});

describe('lightbox', () => {
  it('opens on click, wraps with arrow keys, closes and returns focus', async () => {
    const user = userEvent.setup();
    renderApp('/plog/new-trip');
    const [first] = screen.getAllByRole('button', { name: /alt new-trip/ });

    await user.click(first);
    const dialog = screen.getByRole('dialog', { name: 'Photo viewer' });
    expect(dialog).toHaveAttribute('open');
    expect(within(dialog).getByText('1 of 2')).toBeInTheDocument();

    await user.keyboard('{ArrowLeft}');
    expect(within(dialog).getByText('2 of 2')).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(within(dialog).getByText('1 of 2')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /close/i }));
    expect(dialog).not.toHaveAttribute('open');
    expect(first).toHaveFocus();
  });
});

it('fixture sanity', () => {
  expect(fixture.trips).toHaveLength(3);
});
