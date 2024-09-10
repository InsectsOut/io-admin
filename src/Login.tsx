import styled from 'styled-components';
import { useEffect, useState } from 'react';
import logo1 from './assets/logo1.png';
import img2 from './assets/img2.jpeg';
import img3 from './assets/img3.jpeg';
import img4 from './assets/img4.jpeg';
import img5 from './assets/img5.jpeg'
import img6 from './assets/img6.avif'
import img7 from './assets/img7.webp'
import img8 from './assets/img8.jpeg'
import img9 from './assets/img9.webp'
import img10 from './assets/img10.2.jpeg'
import { supabase } from './utils/ClientSupabase';
import { useNavigate } from 'react-router-dom';
import { StyledForm, StyledInput, StyledButton, StyledAlert } from './FormComponents';
import './App.css'

const LoginCard = styled.div`
    width: 30%;
    height: 70%;
    margin-right: 5rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0px 0px 11px 2px rgba(0,0,0,0.75);
    -webkit-box-shadow: 0px 0px 11px 2px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 11px 2px rgba(0,0,0,0.75);
    position: fixed;
    @media (min-width: 300px) and (max-width: 644px) {
        width:auto;
        height:70%;
        min-height:fit-content;
        margin:0;
        position:relative;
    }

    @media (min-width: 645px) and (max-width: 768px) {
      width:100%;
      height:90%;
    
      margin:0;
      position:relative;
    }

  @media (min-width: 769px) and (max-width: 900px) {
    width:auto;
    height:90%;
    margin:0;
    position:relative;
  }
  `;

const LoginTitle = styled.h1`
    width: 100%;
    height: auto;
    color: black;
    font-weight: lighter;
    font-size: 2rem;
    border-bottom-color: red;
    margin-bottom: 0;
    &.final{
    position: relative;
    top:2rem;
    font-weight:normal;
    font-size:1rem;
    }
  `;

const LoginLogo = styled.img`
    object-fit: fill;
    width: 60%;
    position: relative;
    top: -0.75rem;
  `;

interface loginProps {
  setToken: (token: any) => void;
}

const Login: React.FC<loginProps> = ({ setToken }) => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  useEffect(() => {
    const bgImages = [img2, img4, img3, img5, img6, img7, img8, img9, img10];
    const randomIndex = Math.floor(Math.random() * bgImages.length);
    const selectedImage = bgImages[randomIndex];
    setBackgroundImage(selectedImage);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validate password and set passwordInvalid state accordingly
    if (password.length < 8) {
      setPasswordInvalid(true);
    } else {
      setPasswordInvalid(false);
    }
  };

  const usernameEntered = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const passwordEntered = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const navigate = useNavigate()

  const handleLogin = async () => {

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password
      })

      if (error) {
        console.log(error)
        window.alert("Contraseña o correo incorrectos")
      }

      else {
        await setToken(data)
        localStorage.setItem('token', JSON.stringify(data))
        if (await supabase.auth.getUser()) {
          navigate("/inicio")

        }

      }

    }

    catch (err) {
      console.log(err)
    }

  }


  return (
    <div id='login-card-mover'
      style={{
        color: 'black',
        width: '100%',
        height: '100vh',
        display: 'inline-flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        background: `url(${backgroundImage}) center/cover`,

      }}
    >
      <LoginCard>
        <LoginTitle>Accede con tu cuenta</LoginTitle>
        <LoginLogo src={logo1} alt="Logo" />
        <StyledForm onSubmit={handleSubmit}>
          <StyledInput placeholder="Usuario" type="text" value={username} onChange={usernameEntered} />
          <StyledInput placeholder="Contraseña" type="password" value={password} onChange={passwordEntered} />
          {passwordInvalid && <StyledAlert>Password is invalid.</StyledAlert>}
          <StyledButton type="button" disabled={!username || !password}
            onClick={() => { handleLogin() }}
          >
            Login
          </StyledButton>
        </StyledForm>
        <LoginTitle className='final'>Insects Out Mip</LoginTitle>
        <LoginTitle className='final'>Software de Operación Para Control de Plagas</LoginTitle>
      </LoginCard>
    </div>
  );
};

export default Login;
