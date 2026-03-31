import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Avatar, Box, Link, Toolbar, Button } from '@mui/material';
import { Logo } from './logo';

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar
      elevation={0}
      sx={{ backgroundColor: '#1e212a' }}
    >
      <Toolbar
        disableGutters
        sx={{
          alignItems: 'center',
          display: 'flex',
          minHeight: 64,
          px: 3,
          py: 1
        }}
      >
        {/* Logo */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Logo />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Optional Link */}
        <Link
          color="#ffffff"
          href="https://material-ui.com/store/items/carpatin-dashboard"
          sx={{ mr: 2 }}
          target="_blank"
          variant="body2"
        >
          See Pro Version
        </Link>

        {/* Logout Button */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ mr: 2 }}
        >
          Logout
        </Button>

        {/* Avatar */}
        <Avatar
          alt="User"
          src="/static/user-chen_simmons.png"
        />
      </Toolbar>
    </AppBar>
  );
};