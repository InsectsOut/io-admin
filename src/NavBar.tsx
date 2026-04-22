import styled from "styled-components";
import icon from "./assets/logoOjo.png";
import { FaHome } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoMenuSharp } from "react-icons/io5";
import SlidingMenu from "./SlidingMenu";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import useBodyClick from "./UseBodyClick";
import { useBrandTheme } from "./utils/ThemeContext";

const NavContainer = styled.div`
    width: 100vw;
    height: 8%;
    display: flex;
    background: #f3f3f3;
    box-shadow: 0px 7px 4px rgba(0, 0, 0, 0.25);
    justify-content: flex-start;
    align-items: center;
    &.iconosContainer {
        justify-content: flex-end;
    }
`;

const Logo = styled.img`
    width: 60px;
    height: 60px;
    aspect-ratio: 1/1;
    margin-left: 1rem;
    position: relative;
    top: 0.2rem;
    object-fit: contain;
    transform: scale(1.2);
`;

const IconsContainer = styled.ul`
    display: flex;
    list-style: none;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    gap: 1rem;
    padding-right: 1rem;
`;

const Li = styled.li`
    &:hover {
        cursor: pointer;
        transform: scale(1.2);
    }
`;

function NavBar() {
    const [modalOpen, setModalOpena] = useState(false);
    const [home, setHome] = useState(false);
    const slidingRef = useRef<HTMLLIElement>(null);
    const { theme } = useBrandTheme();

    const navigate = useNavigate();

    const openModal = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevents the body click listener from triggering
        setModalOpena(prev => !prev);
    };

    const navegar = () => {
        if (home) {
            navigate("/inicio");
            setHome(prev => !prev);
        }
    };

    useEffect(() => {
        navegar();
    }, [home]);

    useBodyClick(
        () => {
            setModalOpena(false);
        },
        [slidingRef],
        modalOpen
    );

    return (
        <>
            {window.location.pathname !== "/" && (
                <>
                    <NavContainer>
                        <Logo
                            onClick={() => navigate("/inicio")}
                            loading="lazy"
                            src={theme.logoUrl ?? icon}
                            alt={theme.nombreEmpresa ?? "Logo"}
                        />
                        <IconsContainer className="iconosContainer">
                            <Li
                                onClick={() => {
                                    setHome(true);
                                }}
                            >
                                <FaHome size={30} color={theme.primaryColor} />
                            </Li>
                            <Li onClick={() => navigate("/perfil")}>
                                <MdAccountCircle size={30} color={theme.primaryColor} />
                            </Li>
                            <Li ref={slidingRef} onClick={openModal}>
                                <IoMenuSharp size={30} color={theme.primaryColor} />
                            </Li>
                        </IconsContainer>
                    </NavContainer>
                    <SlidingMenu isOpen={modalOpen} closing={e => openModal(e)} />
                </>
            )}
        </>
    );
}
export default NavBar;
