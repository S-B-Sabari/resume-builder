import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import * as reactRedux from 'react-redux';

// Mock react-redux hooks
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

// Mock useNavigate hook from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar Component', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    reactRedux.useDispatch.mockReturnValue(mockDispatch);
  });

  it('UI-01: should render logo and not show user profile if user is not logged in', () => {
    // Mock useSelector returning no user
    reactRedux.useSelector.mockReturnValue({ user: null });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Verify logo image is rendered
    const logoImg = screen.getByAltText('logo');
    expect(logoImg).toBeInTheDocument();

    // Verify user info / dashboard link is not visible
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('UI-02: should render user details and dashboard button when user is logged in', () => {
    const mockUser = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      image: '',
    };
    reactRedux.useSelector.mockReturnValue({ user: mockUser });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Verify user name and dashboard link are present
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('UI-03: should toggle dropdown and dispatch logout when clicking Log out button', async () => {
    const mockUser = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      image: '',
    };
    reactRedux.useSelector.mockReturnValue({ user: mockUser });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Dropdown should be hidden initially
    expect(screen.queryByText('Account')).not.toBeInTheDocument();

    // Click on the user profile button to open dropdown
    const profileBtn = screen.getByRole('button');
    fireEvent.click(profileBtn);

    // Now account link and logout button should be visible
    expect(screen.getByText('Account')).toBeInTheDocument();
    const logoutBtn = screen.getByText('Log out');
    expect(logoutBtn).toBeInTheDocument();

    // Click logout
    fireEvent.click(logoutBtn);

    // Check if logout action was dispatched and user is redirected
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
