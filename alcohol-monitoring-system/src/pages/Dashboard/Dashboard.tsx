import React from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Button, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Регистрируем компоненты для Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  overflow: 'visible',
  transition: 'all 0.3s',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: 12,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  marginTop: -30,
  marginBottom: 10,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 600,
  padding: '10px 20px',
  transition: 'all 0.3s',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  },
}));

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Данные для графика положительных/отрицательных тестов за неделю
  const weeklyTestData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    datasets: [
      {
        label: 'Отрицательные тесты',
        data: [45, 42, 47, 38, 41, 20, 8],
        backgroundColor: 'rgba(38, 166, 154, 0.6)',
        borderColor: 'rgba(38, 166, 154, 1)',
        borderWidth: 1,
      },
      {
        label: 'Положительные тесты',
        data: [2, 1, 3, 1, 2, 0, 0],
        backgroundColor: 'rgba(239, 83, 80, 0.6)',
        borderColor: 'rgba(239, 83, 80, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Опции для графика
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  // Данные для графика по подразделениям
  const departmentTestData = {
    labels: ['Цех №1', 'Цех №2', 'Цех №3', 'Администрация', 'Финансы', 'Охрана'],
    datasets: [
      {
        label: 'Всего тестов',
        data: [120, 105, 98, 65, 45, 30],
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1,
      },
      {
        label: 'Положительные тесты',
        data: [3, 2, 4, 0, 0, 1],
        backgroundColor: 'rgba(239, 83, 80, 0.6)',
        borderColor: 'rgba(239, 83, 80, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Панель управления
            </Typography>
            <Box>
              <ActionButton
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/testing')}
                startIcon={<AssignmentIcon />}
              >
                Начать тестирование
              </ActionButton>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ pt: 0, pb: '16px !important' }}>
              <IconWrapper sx={{ bgcolor: 'primary.light' }}>
                <PeopleIcon sx={{ color: 'white', fontSize: 28 }} />
              </IconWrapper>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                  254
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Сотрудников всего
                </Typography>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ pt: 0, pb: '16px !important' }}>
              <IconWrapper sx={{ bgcolor: 'tertiary.main' }}>
                <DoneIcon sx={{ color: 'white', fontSize: 28 }} />
              </IconWrapper>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                  42
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Протестировано сегодня
                </Typography>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ pt: 0, pb: '16px !important' }}>
              <IconWrapper sx={{ bgcolor: 'warning.main' }}>
                <HourglassEmptyIcon sx={{ color: 'white', fontSize: 28 }} />
              </IconWrapper>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ожидают повторный тест
                </Typography>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ pt: 0, pb: '16px !important' }}>
              <IconWrapper sx={{ bgcolor: 'error.main' }}>
                <WarningIcon sx={{ color: 'white', fontSize: 28 }} />
              </IconWrapper>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                  2
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Положительных сегодня
                </Typography>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Статистика тестирования за неделю
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={weeklyTestData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Ближайшие задачи
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: 'background.light',
                }}
              >
                <LocalHospitalIcon color="error" sx={{ mr: 1.5 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Повторное тестирование
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Сидоров А.П., Цех №2, 09:30
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: 'background.light',
                }}
              >
                <AssignmentIcon color="primary" sx={{ mr: 1.5 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Оформление направления
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Петров В.С., Цех №1, 10:15
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'background.light',
                }}
              >
                <LocalHospitalIcon color="warning" sx={{ mr: 1.5 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Тестирование новой смены
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Цех №3, 12:00
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/calendar')}
                sx={{ width: '100%', mt: 1 }}
              >
                Показать расписание
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              mt: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Тестирование по подразделениям (апрель)
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={departmentTestData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;