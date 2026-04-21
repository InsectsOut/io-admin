import React, { createContext, useCallback, useContext, useState } from "react";
import styled, { keyframes, css } from "styled-components";

type ToastType = "success" | "error";

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
    leaving: boolean;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const slideIn = keyframes`
    from { transform: translateX(110%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
`;

const fadeOut = keyframes`
    from { transform: translateX(0);    opacity: 1; }
    to   { transform: translateX(110%); opacity: 0; }
`;

const ToastWrapper = styled.div`
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    z-index: 9999;
`;

const ToastCard = styled.div<{ type: ToastType; $leaving: boolean }>`
    min-width: 14rem;
    max-width: 22rem;
    padding: 0.75rem 1.1rem;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
    background: ${({ type }) => (type === "success" ? "#1a7a4a" : "#c0392b")};
    animation: ${({ $leaving }) =>
        $leaving
            ? css`
                  ${fadeOut} 0.35s ease forwards
              `
            : css`
                  ${slideIn} 0.35s ease forwards
              `};
`;

let counter = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = ++counter;
        setToasts(prev => [...prev, { id, message, type, leaving: false }]);

        setTimeout(() => {
            setToasts(prev => prev.map(t => (t.id === id ? { ...t, leaving: true } : t)));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 380);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastWrapper>
                {toasts.map(t => (
                    <ToastCard key={t.id} type={t.type} $leaving={t.leaving}>
                        {t.message}
                    </ToastCard>
                ))}
            </ToastWrapper>
        </ToastContext.Provider>
    );
};

