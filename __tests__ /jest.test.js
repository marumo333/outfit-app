import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../components/header';
import '@testing-library/jest-dom';

describe('Header Component', () => {
    // ...

    test('changes text on button click', async () => {
        render(<Header />);
        const executeButton = screen.getByTestId('excutebutton');

        // 初期状態のテキストを確認 (テストの信頼性を高めるため)
        expect(screen.getByText('Home')).toBeInTheDocument();

        // userEventを使ってクリックをシミュレート
        await userEvent.click(executeButton);

        // ページ遷移とテキスト変更を待つ
        await waitFor(() => {
            // 変化後のテキストが表示されていることを確認
            expect(screen.getByText('Homeにページ遷移後')).toBeInTheDocument();
        });

        
    });
});