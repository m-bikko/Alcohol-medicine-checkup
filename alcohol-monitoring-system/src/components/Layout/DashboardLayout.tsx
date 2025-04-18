import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import HealingIcon from '@mui/icons-material/Healing';
import ChatIcon from '@mui/icons-material/Chat';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Дашборд', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Сотрудники', icon: <PeopleIcon />, path: '/employees' },
  { text: 'Тестирование', icon: <HealingIcon />, path: '/testing' },
  { text: 'Журнал алкотестирования', icon: <AssignmentIcon />, path: '/journal/alcohol-tests' },
  { text: 'Журнал положительных тестов', icon: <LocalHospitalIcon />, path: '/journal/positive-tests' },
  { text: 'Направления', icon: <MedicalInformationIcon />, path: '/referrals' },
  { text: 'Акты отказа', icon: <ChatIcon />, path: '/refusal-acts' },
  { text: 'Настройки', icon: <SettingsIcon />, path: '/settings' },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfileOpen = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  const getCurrentPageTitle = () => {
    const currentMenuItem = menuItems.find((item) => item.path === location.pathname);
    return currentMenuItem ? currentMenuItem.text : 'Система алкотестирования сотрудников';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <HealthAndSafetyIcon sx={{ fontSize: 32, marginRight: 1 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '.05rem',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              МедКонтроль
            </Typography>
          </Box>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getCurrentPageTitle()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Профиль пользователя">
              <Button 
                sx={{ 
                  textTransform: 'none', 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                  borderRadius: 2,
                  py: 1,
                  px: 2
                }}
                onClick={handleProfileMenuOpen}
                startIcon={
                  <Avatar
                    alt={user?.name || ''}
                    sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                  >
                    {user?.name ? user.name.charAt(0) : 'M'}
                  </Avatar>
                }
              >
                {user?.name || 'Мед. работник'}
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileOpen}>Профиль</MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Выйти
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            backgroundColor: 'primary.light',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HealthAndSafetyIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              МедКонтроль
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {user?.department || 'Выберите подразделение'}
          </Typography>
        </Box>
        <Divider />
        <List component="nav" sx={{ flex: 1, px: 1.5, py: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  fontSize: '0.9rem',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: location.pathname === item.path ? 'white' : 'primary.main',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            © 2023 МедКонтроль
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Версия 1.0.0
          </Typography>
        </Box>
      </Drawer>
      <Main open={open} sx={{ flex: 1, overflow: 'auto', pt: '64px', backgroundColor: 'background.default' }}>
        <Box component="div" sx={{ p: 2 }}>
          {children}
        </Box>
      </Main>
    </Box>
  );
};

export default DashboardLayout;