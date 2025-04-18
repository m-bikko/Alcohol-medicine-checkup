import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Container,
  Card,
  CardContent,
  CardActionArea,
  Fade,
  TextField,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { departments } from '../../mock/data';

const DepartmentCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  transition: 'all 0.3s',
  height: '100%',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    backgroundColor: theme.palette.primary.light,
    '& .MuiTypography-root': {
      color: theme.palette.common.white,
    },
  },
}));

const DepartmentSelect: React.FC = () => {
  const navigate = useNavigate();
  const { selectDepartment } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDepartmentSelect = (departmentName: string) => {
    setSelectedDepartment(departmentName);
  };

  const handleContinue = () => {
    if (selectedDepartment) {
      selectDepartment(selectedDepartment);
      navigate('/dashboard');
    }
  };

  // Фильтрация подразделений по поисковому запросу
  const filteredDepartments = departments.filter(
    (dept) => dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <HealthAndSafetyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
              Выберите подразделение
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Выберите подразделение, в котором вы будете проводить алкотестирование сотрудников
            </Typography>

            <TextField
              placeholder="Поиск подразделения..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                maxWidth: 500,
                mx: 'auto',
                mb: 5,
                '.MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Grid container spacing={3}>
            {filteredDepartments.map((department) => (
              <Grid item key={department.id} xs={12} sm={6} md={4}>
                <DepartmentCard
                  variant="outlined"
                  sx={{
                    ...(selectedDepartment === department.name && {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                      boxShadow: (theme) => `0 8px 16px ${theme.palette.primary.main}20`,
                    }),
                  }}
                >
                  <CardActionArea
                    onClick={() => handleDepartmentSelect(department.name)}
                    sx={{ height: '100%', p: 1 }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{ fontWeight: 600, mb: 1 }}
                          className="title"
                        >
                          {department.name}
                        </Typography>
                        {selectedDepartment === department.name && (
                          <CheckCircleIcon color="primary" />
                        )}
                      </Box>
                      {department.subdivision && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="description"
                        >
                          {department.subdivision}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </DepartmentCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!selectedDepartment}
              onClick={handleContinue}
              sx={{
                minWidth: 200,
                py: 1.5,
                px: 4,
                borderRadius: 2,
                boxShadow: 2,
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              Продолжить
            </Button>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default DepartmentSelect;