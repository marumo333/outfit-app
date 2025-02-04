import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/header'; // Headerのパスを正しく指定

describe('Header Component', () => {
    test('renders correctly', () => {
        render(<Header />);

        const homeLink = screen.getByText('Home');
        expect(homeLink).toBeInTheDocument();

        const executeButton = screen.getByTestId('excutebutton');
        expect(executeButton).toBeInTheDocument();
    });

    test('changes text on button click', () => {
        render(<Header />);

        const executeButton = screen.getByTestId('excutebutton');
        executeButton.click();

        const updatedText = screen.getByText('Homeにページ遷移後');
        expect(updatedText).toBeInTheDocument();
    });
});
