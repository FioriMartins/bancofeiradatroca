import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Logout from '@mui/icons-material/Logout';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText'

import Alerta from '../Alerta/Alerta'

import './SideBarFixed.css'

function ConfirmLogIn({ handleClose, open, username }) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [openAlertError, setOpenAlertError] = useState(false)
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false)
  const [error, setError] = useState(false)

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenAlertError(false)
    setOpenAlertSuccess(false)
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password })
      let account = {
        token: response.data.token,
        username: username,
        status: response.status
      }
      localStorage.setItem("token", JSON.stringify(account));
      handleClose()
      setOpenAlertSuccess(true)
    } catch (error) {
      setOpenAlertError(true)
      setError(true)
    }
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          handleClose()
          setError(false)
        }}
      >
        <DialogTitle>{username}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, insira sua senha para continuar.
          </DialogContentText>
          <FormControl sx={{ m: 1, width: '25ch' }} error={error} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">Senha</InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin()
                }
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{error ? 'Senha inválida' : 'Digite sua senha'}</FormHelperText>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            handleClose()
            setError(false)
          }}>Cancelar</Button>
          <Button type="submit" onClick={handleLogin}>Entrar</Button>
        </DialogActions>
      </Dialog>
      <Alerta state={openAlertError} onClose={handleCloseAlert} text="A senha está incorreta." severity="error" />
      <Alerta state={openAlertSuccess} onClose={handleCloseAlert} text="Login bem-sucedido!" severity="success" />
    </>
  );
}

export default function SideBar() {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [usernames, setUsernames] = useState()
  const [nomeUser, setNomeUser] = useState("Unknow")
  const navigate = useNavigate()
  const sidebardiv = useRef()
  const textButtons = useRef([])
  const divButtons = useRef([])
  const [iconAtivo, setIconAtivo] = useState(1)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const location = useLocation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchUsernames()
  };

  const handleLogout = (event) => {
    localStorage.removeItem('token')
    location.reload()
  }

  const handleClose = () => {
    setAnchorEl(null)
  };

  const handleClickOpenConfirm = (nome) => {
    setNomeUser(nome)
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };


  const fetchUsernames = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/users")
      setUsernames(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const goToHome = () => navigate('/')

  const goToComandas = () => navigate('/comandas')

  const goToCaixas = () => navigate('/estoque')

  const goToGraficos = () => navigate('/graficos')

  const goToVenda = () => navigate('/venda')

  const goToConfig = () => navigate('/config')

  const toggleClass = (params) => {
    if (params == iconAtivo) {
      divButtons.current[params].id = 'selected'
      setIconAtivo(params)
    } else {
      divButtons.current[iconAtivo].id = 'icon'
      divButtons.current[params].id = 'selected'
      setIconAtivo(params)
    }
  }

  return (
    <>
      <div
        className="side-bar"
        ref={sidebardiv}
      >
        <div className='buttons'>
          <div id={location.pathname === "/" ? "selected" : "icon"} ref={(el) => (divButtons.current[1] = el)} onClick={() => { goToHome(), toggleClass(1) }}>
            <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M29.1667 8.75H8.75V29.1667H29.1667V8.75Z" stroke="#E8F7F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M61.25 8.75H40.8333V29.1667H61.25V8.75Z" stroke="#E8F7F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M61.25 40.8333H40.8333V61.25H61.25V40.8333Z" stroke="#E8F7F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M29.1667 40.8333H8.75V61.25H29.1667V40.8333Z" stroke="#E8F7F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p ref={(el) => (textButtons.current[0] = el)}>Produtos</p>
          </div>
          <div id={location.pathname === "/estoque" ? "selected" : "icon"} ref={(el) => (divButtons.current[2] = el)} onClick={() => { goToCaixas(), toggleClass(2) }}>
            <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M48.125 27.4166L21.875 12.2791M9.5375 20.3L35 35.0291L60.4625 20.3M35 64.4V35M61.25 46.6666V23.3333C61.249 22.3104 60.9789 21.3057 60.467 20.42C59.9551 19.5344 59.2192 18.799 58.3333 18.2875L37.9167 6.62081C37.0299 6.10883 36.024 5.83929 35 5.83929C33.976 5.83929 32.9701 6.10883 32.0833 6.62081L11.6667 18.2875C10.7808 18.799 10.0449 19.5344 9.53301 20.42C9.02108 21.3057 8.75105 22.3104 8.75 23.3333V46.6666C8.75105 47.6896 9.02108 48.6943 9.53301 49.5799C10.0449 50.4656 10.7808 51.201 11.6667 51.7125L32.0833 63.3791C32.9701 63.8911 33.976 64.1607 35 64.1607C36.024 64.1607 37.0299 63.8911 37.9167 63.3791L58.3333 51.7125C59.2192 51.201 59.9551 50.4656 60.467 49.5799C60.9789 48.6943 61.249 47.6896 61.25 46.6666Z" stroke="#E8F7F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p ref={(el) => (textButtons.current[1] = el)}>Estoque</p>
          </div>
          <div id={location.pathname === "/comandas" ? "selected" : "icon"} ref={(el) => (divButtons.current[3] = el)} onClick={() => { goToComandas(), toggleClass(3) }}>
            <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.91663 29.1667H67.0833M8.74996 11.6667H61.25C64.4716 11.6667 67.0833 14.2783 67.0833 17.5V52.5C67.0833 55.7216 64.4716 58.3333 61.25 58.3333H8.74996C5.5283 58.3333 2.91663 55.7216 2.91663 52.5V17.5C2.91663 14.2783 5.5283 11.6667 8.74996 11.6667Z" stroke="#E8F7F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p ref={(el) => (textButtons.current[2] = el)}>Comandas</p>
          </div>
          <div id={location.pathname === "/graficos" ? "selected" : "icon"} ref={(el) => (divButtons.current[4] = el)} onClick={() => { goToGraficos(), toggleClass(4) }}>
            <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M61.8625 46.3458C60.007 50.7339 57.1048 54.6006 53.4096 57.608C49.7145 60.6153 45.3389 62.6717 40.6654 63.5973C35.992 64.5229 31.1629 64.2896 26.6004 62.9178C22.038 61.5459 17.881 59.0773 14.493 55.7278C11.105 52.3782 8.58904 48.2497 7.16518 43.7032C5.74133 39.1567 5.45288 34.3306 6.32507 29.6469C7.19726 24.9631 9.20353 20.5643 12.1685 16.8351C15.1334 13.1059 18.9667 10.1597 23.3333 8.25418M64.1667 35C64.1667 31.1698 63.4123 27.3771 61.9465 23.8384C60.4807 20.2997 58.3323 17.0844 55.624 14.3761C52.9156 11.6677 49.7003 9.51929 46.1616 8.05352C42.6229 6.58776 38.8302 5.83334 35 5.83334V35H64.1667Z" stroke="#E8F7F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p ref={(el) => (textButtons.current[3] = el)}>Gráficos</p>
          </div>
          <div id={location.pathname === "/venda" ? "selected" : "icon"} ref={(el) => (divButtons.current[5] = el)} onClick={() => { goToVenda(), toggleClass(5) }}>
            <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35 2.91667V67.0833M49.5833 14.5833H27.7083C25.0009 14.5833 22.4044 15.6589 20.49 17.5733C18.5755 19.4877 17.5 22.0843 17.5 24.7917C17.5 27.4991 18.5755 30.0956 20.49 32.0101C22.4044 33.9245 25.0009 35 27.7083 35H42.2917C44.9991 35 47.5956 36.0755 49.5101 37.99C51.4245 39.9044 52.5 42.5009 52.5 45.2083C52.5 47.9158 51.4245 50.5123 49.5101 52.4267C47.5956 54.3412 44.9991 55.4167 42.2917 55.4167H17.5" stroke="#E8F7F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p ref={(el) => (textButtons.current[4] = el)}>Vender</p>
          </div>
          <div id={location.pathname === "/config" ? "selected" : "icon"} ref={(el) => (divButtons.current[6] = el)} onClick={() => { goToConfig(), toggleClass(6) }}>
            <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35 43.75C39.8325 43.75 43.75 39.8325 43.75 35C43.75 30.1675 39.8325 26.25 35 26.25C30.1675 26.25 26.25 30.1675 26.25 35C26.25 39.8325 30.1675 43.75 35 43.75Z" stroke="#E8F7F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M56.5833 43.75C56.195 44.6297 56.0792 45.6056 56.2508 46.5517C56.4223 47.4979 56.8734 48.3709 57.5458 49.0583L57.7208 49.2333C58.2632 49.7751 58.6934 50.4184 58.987 51.1266C59.2805 51.8348 59.4316 52.5938 59.4316 53.3604C59.4316 54.127 59.2805 54.8861 58.987 55.5942C58.6934 56.3024 58.2632 56.9457 57.7208 57.4875C57.179 58.0299 56.5357 58.4601 55.8275 58.7537C55.1194 59.0472 54.3603 59.1983 53.5937 59.1983C52.8271 59.1983 52.0681 59.0472 51.3599 58.7537C50.6517 58.4601 50.0084 58.0299 49.4666 57.4875L49.2916 57.3125C48.6042 56.6401 47.7312 56.189 46.785 56.0175C45.8389 55.8459 44.863 55.9618 43.9833 56.35C43.1206 56.7197 42.3849 57.3336 41.8667 58.1162C41.3485 58.8987 41.0704 59.8156 41.0666 60.7542V61.25C41.0666 62.7971 40.452 64.2808 39.3581 65.3748C38.2641 66.4688 36.7804 67.0833 35.2333 67.0833C33.6862 67.0833 32.2025 66.4688 31.1085 65.3748C30.0145 64.2808 29.4 62.7971 29.4 61.25V60.9875C29.3774 60.0221 29.0649 59.0858 28.5031 58.3004C27.9413 57.5149 27.1563 56.9167 26.25 56.5833C25.3702 56.1951 24.3944 56.0793 23.4482 56.2508C22.5021 56.4224 21.629 56.8734 20.9416 57.5458L20.7666 57.7208C20.2249 58.2632 19.5815 58.6935 18.8734 58.987C18.1652 59.2806 17.4061 59.4317 16.6395 59.4317C15.873 59.4317 15.1139 59.2806 14.4057 58.987C13.6976 58.6935 13.0542 58.2632 12.5125 57.7208C11.9701 57.1791 11.5398 56.5357 11.2463 55.8276C10.9527 55.1194 10.8016 54.3603 10.8016 53.5938C10.8016 52.8272 10.9527 52.0681 11.2463 51.3599C11.5398 50.6518 11.9701 50.0084 12.5125 49.4667L12.6875 49.2917C13.3599 48.6043 13.8109 47.7312 13.9825 46.7851C14.154 45.8389 14.0382 44.8631 13.65 43.9833C13.2802 43.1207 12.6663 42.385 11.8838 41.8667C11.1013 41.3485 10.1843 41.0704 9.24579 41.0667H8.74996C7.20286 41.0667 5.71913 40.4521 4.62517 39.3581C3.53121 38.2642 2.91663 36.7804 2.91663 35.2333C2.91663 33.6862 3.53121 32.2025 4.62517 31.1085C5.71913 30.0146 7.20286 29.4 8.74996 29.4H9.01246C9.97786 29.3774 10.9141 29.0649 11.6996 28.5032C12.485 27.9414 13.0833 27.1563 13.4166 26.25C13.8049 25.3703 13.9207 24.3944 13.7491 23.4483C13.5776 22.5021 13.1265 21.6291 12.4541 20.9417L12.2791 20.7667C11.7368 20.2249 11.3065 19.5816 11.0129 18.8734C10.7194 18.1652 10.5683 17.4062 10.5683 16.6396C10.5683 15.873 10.7194 15.1139 11.0129 14.4058C11.3065 13.6976 11.7368 13.0543 12.2791 12.5125C12.8209 11.9701 13.4642 11.5399 14.1724 11.2463C14.8805 10.9528 15.6396 10.8017 16.4062 10.8017C17.1728 10.8017 17.9319 10.9528 18.64 11.2463C19.3482 11.5399 19.9915 11.9701 20.5333 12.5125L20.7083 12.6875C21.3957 13.3599 22.2688 13.811 23.2149 13.9825C24.1611 14.1541 25.1369 14.0383 26.0166 13.65H26.25C27.1126 13.2803 27.8483 12.6664 28.3666 11.8839C28.8848 11.1013 29.1629 10.1844 29.1666 9.24584V8.75C29.1666 7.20291 29.7812 5.71917 30.8752 4.62521C31.9691 3.53125 33.4529 2.91667 35 2.91667C36.5471 2.91667 38.0308 3.53125 39.1248 4.62521C40.2187 5.71917 40.8333 7.20291 40.8333 8.75V9.0125C40.837 9.95105 41.1151 10.868 41.6334 11.6505C42.1516 12.433 42.8873 13.0469 43.75 13.4167C44.6297 13.8049 45.6055 13.9207 46.5517 13.7492C47.4978 13.5776 48.3709 13.1266 49.0583 12.4542L49.2333 12.2792C49.7751 11.7368 50.4184 11.3065 51.1266 11.013C51.8347 10.7194 52.5938 10.5683 53.3604 10.5683C54.127 10.5683 54.886 10.7194 55.5942 11.013C56.3024 11.3065 56.9457 11.7368 57.4875 12.2792C58.0298 12.8209 58.4601 13.4643 58.7536 14.1724C59.0472 14.8806 59.1983 15.6397 59.1983 16.4063C59.1983 17.1728 59.0472 17.9319 58.7536 18.6401C58.4601 19.3482 58.0298 19.9916 57.4875 20.5333L57.3125 20.7083C56.6401 21.3957 56.189 22.2688 56.0175 23.215C55.8459 24.1611 55.9617 25.137 56.35 26.0167V26.25C56.7197 27.1127 57.3336 27.8484 58.1161 28.3666C58.8986 28.8848 59.8156 29.1629 60.7541 29.1667H61.25C62.7971 29.1667 64.2808 29.7813 65.3748 30.8752C66.4687 31.9692 67.0833 33.4529 67.0833 35C67.0833 36.5471 66.4687 38.0308 65.3748 39.1248C64.2808 40.2188 62.7971 40.8333 61.25 40.8333H60.9875C60.0489 40.8371 59.132 41.1152 58.3494 41.6334C57.5669 42.1516 56.953 42.8873 56.5833 43.75Z" stroke="#E8F7F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p ref={(el) => (textButtons.current[5] = el)}>Ajustes</p>
          </div>
        </div>
        <div className='footerSideBar'>
          {JSON.parse(localStorage.getItem('token')).status === 200 ? (
            <Tooltip title="Opções de Log In">
              <div className="logInButtonDiv" onClick={handleClick}>
                <Avatar alt={JSON.parse(localStorage.getItem('token')).username} src='#' />
                <p>{JSON.parse(localStorage.getItem('token')).username}</p>
              </div>
            </Tooltip>
          ) : (
            <Tooltip title="Opções de Log In">
              <div className="logInButtonDiv" onClick={handleClick}>
                <Avatar />
                <p>Log In</p>
              </div>
            </Tooltip>
          )}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: 'none',
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {JSON.parse(localStorage.getItem('token')).status === 200 ? (
              <MenuItem disabled>Conectado.</MenuItem>
            ) : (
              <div>
                {Array.isArray(usernames) && usernames.map((user) => (
                  <MenuItem key={user.id} onClick={() => handleClickOpenConfirm(user.username)}>
                    <Avatar alt={user.username} src='aa' /> {user.username}
                  </MenuItem>
                ))}
              </div>
            )}
            <Divider />
            {JSON.parse(localStorage.getItem('token')).status === 200 ? (
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
            ) : (
              <MenuItem disabled>
                Escolha uma opção.
              </MenuItem>
            )}
          </Menu>
        </div>
      </div>
      <ConfirmLogIn handleClose={handleCloseConfirm} open={openConfirm} username={nomeUser} />
    </>
  )
}