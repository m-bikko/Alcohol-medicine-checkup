import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Container,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff, Phone, ArrowForward } from '@mui/icons-material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Очищаем ввод от всех нецифровых символов
    const cleanedValue = e.target.value.replace(/[^0-9]/g, '');
    
    // Форматируем номер телефона
    let formattedValue = '';
    if (cleanedValue.length > 0) {
      formattedValue = '+' + cleanedValue;
      if (cleanedValue.length > 1) {
        formattedValue = formattedValue.substring(0, 2) + ' ' + formattedValue.substring(2);
      }
      if (cleanedValue.length > 4) {
        formattedValue = formattedValue.substring(0, 6) + ' ' + formattedValue.substring(6);
      }
      if (cleanedValue.length > 7) {
        formattedValue = formattedValue.substring(0, 10) + ' ' + formattedValue.substring(10);
      }
      if (cleanedValue.length > 9) {
        formattedValue = formattedValue.substring(0, 13) + ' ' + formattedValue.substring(13);
      }
    }
    
    setPhoneNumber(formattedValue);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Проверяем длину номера телефона
    const cleanedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanedPhoneNumber.length < 10) {
      setError('Пожалуйста, введите корректный номер телефона');
      return;
    }

    if (!password) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    try {
      setLoading(true);
      await login(phoneNumber, password);
      setLoading(false);
      navigate('/department-select');
    } catch (error) {
      setLoading(false);
      setError('Неверный номер телефона или пароль');
    }
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ height: '100vh', display: 'flex' }}>
      <Box
        sx={{
          flex: { xs: 0, md: 1 },
          display: { xs: 'none', md: 'flex' },
          bgcolor: 'primary.main',
          color: 'white',
          p: 4,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'linear-gradient(to bottom right, #004c4f, #006064)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 600 }}>
          <Fade in={true} timeout={1000}>
            <Box>
              <HealthAndSafetyIcon sx={{ fontSize: 70, mb: 3 }} />
              <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
                МедКонтроль
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}>
                Система учёта алкотестирования работников
              </Typography>
              <Box sx={{ mb: 6, mx: 'auto', maxWidth: 500 }}>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
                  Автоматизированная система для учета и документирования результатов алкотестирования сотрудников на предприятии.
                </Typography>
              </Box>
            </Box>
          </Fade>

          <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'white', opacity: 0.9, mb: 2 }}>
                Система позволяет:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 0, opacity: 0.8 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Проводить тестирование сотрудников и фиксировать результаты
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Управлять списками сотрудников и подразделений
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Генерировать направления и акты автоматически
                </Typography>
                <Typography component="li" variant="body2">
                  Вести электронные журналы учета тестирования
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Декоративные элементы */}
        <Box
          sx={{
            position: 'absolute',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            bottom: '-15%',
            left: '-10%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '25%',
            height: '25%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            top: '10%',
            right: '5%',
          }}
        />
      </Box>

      <Box
        sx={{
          flex: { xs: 1, md: 0.7 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          bgcolor: 'background.default',
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper
            elevation={4}
            sx={{
              width: '100%',
              maxWidth: 480,
              p: 4,
              borderRadius: 3,
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
                <HealthAndSafetyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  МедКонтроль
                </Typography>
              </Box>
              <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
                Вход в систему
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Введите ваши учетные данные для входа
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Номер телефона"
                variant="outlined"
                fullWidth
                value={phoneNumber}
                onChange={handlePhoneChange}
                margin="normal"
                placeholder="+7 xxx xxx xx xx"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '.MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Пароль"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handlePasswordToggle} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '.MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
                endIcon={loading ? undefined : <ArrowForward />}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
              </Button>
            </form>

            <Box sx={{ mt: 3, mb: 2 }}>
              <Divider>
                <Typography variant="body2" color="text.secondary">
                  или
                </Typography>
              </Divider>
            </Box>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500,
                fontSize: '1rem',
              }}
            >
              Войти через E-Gov
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Если у вас возникли проблемы со входом, обратитесь к администратору системы
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
};

export default Login;