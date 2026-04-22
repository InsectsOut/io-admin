import { useEffect, useState } from "react";
import styled from "styled-components";

const PRIMARY = "#0d4e80"; // fallback — overridden by theme at runtime
const INACTIVE = "#e0e0e0";
const LABEL_ACTIVE = "#fff"; // white text when active
const LABEL_INACTIVE = "#6b8aac";

enum ProductoOption {
    Plaguicidas = "Plaguicidas",
    EquiposDeControl = "Equipos de control",
    Computo = "Computo",
    Otros = "Otros",
}

const SwitchWrapper = styled.div<{ count: number }>`
    display: flex;
    align-items: center;
    cursor: pointer;
    background: ${INACTIVE};
    border-radius: 16px;
    width: 360px;
    height: 40px;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    z-index: 0;
`;

const SwitchThumb = styled.div<{ index: number; count: number }>`
    width: ${({ count }) => 100 / count}%;
    height: 100%;
    background: ${({ theme }) => theme.primaryColor};
    border-radius: 16px;
    position: absolute;
    top: 0;
    left: 0;
    transform: ${({ index }) => `translateX(${index * 100}%)`};
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
`;

const Label = styled.span<{ selected?: boolean }>`
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: ${({ selected }) => (selected ? LABEL_ACTIVE : LABEL_INACTIVE)};
    font-weight: 600;
    user-select: none;
    transition: color 0.2s;
    z-index: 1;
`;

interface SwitchProps {
    options: ProductoOption[];
    optionSender: (option: ProductoOption) => void;
}

const FourWaySwitch: React.FC<SwitchProps> = ({ options, optionSender }) => {
    const [index, setIndex] = useState(0);

    const handleClick = (newIndex: number) => {
        setIndex(newIndex);
    };

    useEffect(() => {
        optionSender(options[index]);
    }, [index, options, optionSender]);

    return (
        <SwitchWrapper count={options.length}>
            <SwitchThumb index={index} count={options.length} />
            {options.map((opt, i) => (
                <Label key={opt} selected={i === index} onClick={() => handleClick(i)}>
                    {opt}
                </Label>
            ))}
        </SwitchWrapper>
    );
};

export default FourWaySwitch;

