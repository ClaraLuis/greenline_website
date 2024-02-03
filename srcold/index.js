import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LanguageProvider } from './LanguageContext';
import { Loggedincontext_provider } from './Loggedincontext.js';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Loggedincontext_provider>
                <LanguageProvider>
                    <App />
                </LanguageProvider>
            </Loggedincontext_provider>
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
