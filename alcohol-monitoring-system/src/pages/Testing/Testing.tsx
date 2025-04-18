import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  Divider,
  IconButton,
  Card,
  CardContent,
  InputAdornment,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonSearch as PersonSearchIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  RestartAlt as RestartAltIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Print as PrintIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  HourglassEmpty as HourglassEmptyIcon,
  FileDownload as DownloadIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { employees } from '../../mock/data';
import { Employee } from '../../types';
import { formatDate, formatTime, getCurrentDate, getCurrentTime } from '../../utils/formatUtils';

const steps = [
  'Выбор сотрудника',
  'Проведение теста',
  'Регистрация результата',
  'Оформление документа',
];

interface TestResult {
  value: number;
  isPositive: boolean;
  testTime: string;
  deviceId: string;
}

const Testing: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [testType, setTestType] = useState<'automatic' | 'manual'>('automatic');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isRetestNeeded, setIsRetestNeeded] = useState(false);
  const [retestResult, setRetestResult] = useState<TestResult | null>(null);
  const [testTime, setTestTime] = useState(getCurrentTime());
  const [testDate, setTestDate] = useState(getCurrentDate());
  const [deviceId, setDeviceId] = useState('ALC-2023-001');
  const [manualTestValue, setManualTestValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [documentType, setDocumentType] = useState<
    'tallon' | 'referral' | 'refusalAct' | null
  >(null);
  const [documentReady, setDocumentReady] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSearchTerm('');
    setSelectedEmployee(null);
    setTestType('automatic');
    setTestResult(null);
    setIsRetestNeeded(false);
    setRetestResult(null);
    setTestTime(getCurrentTime());
    setTestDate(getCurrentDate());
    setManualTestValue('');
    setIsProcessing(false);
    setDocumentType(null);
    setDocumentReady(false);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    handleNext();
  };

  const handleStartTest = () => {
    setIsProcessing(true);

    // Имитация процесса тестирования
    setTimeout(() => {
      const value = testType === 'automatic' ? Math.random() * 0.8 : parseFloat(manualTestValue);
      const isPositive = value >= 0.3;

      setTestResult({
        value,
        isPositive,
        testTime: getCurrentTime(),
        deviceId,
      });

      setIsProcessing(false);
      setIsRetestNeeded(isPositive);
      handleNext();
    }, 2000);
  };

  const handleConfirmResult = () => {
    if (isRetestNeeded && !retestResult) {
      setIsConfirmDialogOpen(true);
    } else {
      handleNext();
      // Определяем тип документа в зависимости от результатов теста
      if (!testResult?.isPositive) {
        // Отрицательный результат - талон-допуск
        setDocumentType('tallon');
      } else if (isRetestNeeded && retestResult && !retestResult.isPositive) {
        // Первый положительный, повторный отрицательный - акт
        setDocumentType('tallon');
      } else if (isRetestNeeded && retestResult && retestResult.isPositive) {
        // Оба положительные - направление
        setDocumentType('referral');
      }
      setTimeout(() => setDocumentReady(true), 1000);
    }
  };

  const handleStartRetest = () => {
    setIsProcessing(true);

    // Имитация процесса повторного тестирования
    setTimeout(() => {
      const value = testType === 'automatic' ? Math.random() * 0.8 : parseFloat(manualTestValue);
      const isPositive = value >= 0.3;

      setRetestResult({
        value,
        isPositive,
        testTime: getCurrentTime(),
        deviceId,
      });

      setIsProcessing(false);
    }, 2000);
  };

  const handleCreateRefusalAct = () => {
    setIsConfirmDialogOpen(false);
    setDocumentType('refusalAct');
    handleNext();
    setTimeout(() => setDocumentReady(true), 1000);
  };

  const handleContinueWithoutRetest = () => {
    setIsConfirmDialogOpen(false);
    setDocumentType('referral');
    handleNext();
    setTimeout(() => setDocumentReady(true), 1000);
  };

  // Фильтрация сотрудников по поисковому запросу
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.personalId.includes(searchTerm) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: GridColDef[] = [
    {
      field: 'personalId',
      headerName: 'Табельный номер',
      width: 150,
    },
    {
      field: 'fullName',
      headerName: 'ФИО',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.position}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'department',
      headerName: 'Подразделение',
      width: 180,
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleEmployeeSelect(params.row)}
          sx={{ borderRadius: 8 }}
        >
          Выбрать
        </Button>
      ),
    },
  ];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Поиск сотрудника
              </Typography>
              <TextField
                placeholder="Поиск по ФИО, табельному номеру или подразделению..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ height: 400 }}>
                <DataGrid
                  rows={filteredEmployees}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            </Paper>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{ bgcolor: 'primary.light', mr: 2 }}
                          alt={selectedEmployee?.fullName}
                        >
                          {selectedEmployee?.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {selectedEmployee?.fullName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedEmployee?.position}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Табельный номер
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {selectedEmployee?.personalId}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Дата рождения
                          </Typography>
                          <Typography variant="body2">
                            {selectedEmployee?.birthDate}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Подразделение
                          </Typography>
                          <Typography variant="body2">
                            {selectedEmployee?.department}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Последний медосмотр
                          </Typography>
                          <Typography variant="body2">
                            {selectedEmployee?.lastMedicalExamDate}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  <Box sx={{ mb: 3 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Способ проведения теста</FormLabel>
                      <RadioGroup
                        row
                        value={testType}
                        onChange={(e) => setTestType(e.target.value as 'automatic' | 'manual')}
                      >
                        <FormControlLabel
                          value="automatic"
                          control={<Radio />}
                          label="Автоматическое устройство"
                        />
                        <FormControlLabel
                          value="manual"
                          control={<Radio />}
                          label="Ручной ввод"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Дата"
                        variant="outlined"
                        fullWidth
                        value={testDate}
                        onChange={(e) => setTestDate(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Время"
                        variant="outlined"
                        fullWidth
                        value={testTime}
                        onChange={(e) => setTestTime(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="ID устройства"
                        variant="outlined"
                        fullWidth
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'background.light',
                      p: 3,
                      borderRadius: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {testType === 'automatic' ? (
                      <Box sx={{ textAlign: 'center' }}>
                        <img
                          src="https://via.placeholder.com/150x150"
                          alt="Устройство алкотестера"
                          style={{ maxWidth: '100%', height: 'auto', marginBottom: 16 }}
                        />
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Алкотестер {deviceId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Подключено и готово к использованию
                        </Typography>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleStartTest}
                          disabled={isProcessing}
                          fullWidth
                          sx={{ borderRadius: 2, py: 1.5 }}
                        >
                          {isProcessing ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            'Начать тестирование'
                          )}
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                          Ручной ввод результата
                        </Typography>
                        <TextField
                          label="Результат теста (промилле)"
                          variant="outlined"
                          fullWidth
                          value={manualTestValue}
                          onChange={(e) => setManualTestValue(e.target.value)}
                          type="number"
                          inputProps={{ step: 0.01, min: 0, max: 5 }}
                          sx={{ mb: 3 }}
                        />
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleStartTest}
                          disabled={isProcessing || !manualTestValue}
                          fullWidth
                          sx={{ borderRadius: 2, py: 1.5 }}
                        >
                          {isProcessing ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            'Сохранить результат'
                          )}
                        </Button>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack} sx={{ borderRadius: 2 }}>
                Назад
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Результаты тестирования
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      mb: 3,
                      border: '1px solid',
                      borderColor: testResult?.isPositive ? 'error.light' : 'success.light',
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                        Первичное тестирование
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testDate}, {testResult?.testTime}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          my: 3,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            bgcolor: testResult?.isPositive
                              ? 'error.light'
                              : 'success.light',
                            color: 'white',
                            position: 'relative',
                          }}
                        >
                          <Typography variant="h4" sx={{ fontWeight: 700, zIndex: 1 }}>
                            {testResult?.value.toFixed(2)}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              bottom: 20,
                              fontWeight: 500,
                              zIndex: 1,
                            }}
                          >
                            промилле
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: testResult?.isPositive
                            ? 'error.light'
                            : 'success.light',
                          color: 'white',
                          mb: 2,
                        }}
                      >
                        {testResult?.isPositive ? (
                          <WarningIcon sx={{ mr: 1 }} />
                        ) : (
                          <CheckCircleIcon sx={{ mr: 1 }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {testResult?.isPositive
                            ? 'Результат положительный'
                            : 'Результат отрицательный'}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Устройство: {testResult?.deviceId}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {isRetestNeeded && (
                    <Box>
                      <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Требуется повторное тестирование
                        </Typography>
                        <Typography variant="caption">
                          Первичный тест показал положительный результат. В соответствии с
                          протоколом необходимо провести повторное тестирование.
                        </Typography>
                      </Alert>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {isRetestNeeded && !retestResult && (
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: 'background.light',
                        p: 3,
                        borderRadius: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <HourglassEmptyIcon
                        color="action"
                        sx={{ fontSize: 48, mb: 2, opacity: 0.7 }}
                      />
                      <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                        Необходимо повторное тестирование
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3, textAlign: 'center' }}
                      >
                        Подтвердите результат первичного тестирования, проведя повторный тест
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleStartRetest}
                        disabled={isProcessing}
                        sx={{ borderRadius: 2, py: 1.5, px: 4 }}
                      >
                        {isProcessing ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Провести повторный тест'
                        )}
                      </Button>
                    </Paper>
                  )}

                  {retestResult && (
                    <Card
                      sx={{
                        borderRadius: 3,
                        mb: 3,
                        border: '1px solid',
                        borderColor: retestResult.isPositive
                          ? 'error.light'
                          : 'success.light',
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                          Повторное тестирование
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testDate}, {retestResult.testTime}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            my: 3,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 100,
                              height: 100,
                              borderRadius: '50%',
                              bgcolor: retestResult.isPositive
                                ? 'error.light'
                                : 'success.light',
                              color: 'white',
                              position: 'relative',
                            }}
                          >
                            <Typography variant="h4" sx={{ fontWeight: 700, zIndex: 1 }}>
                              {retestResult.value.toFixed(2)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                position: 'absolute',
                                bottom: 20,
                                fontWeight: 500,
                                zIndex: 1,
                              }}
                            >
                              промилле
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: retestResult.isPositive
                              ? 'error.light'
                              : 'success.light',
                            color: 'white',
                            mb: 2,
                          }}
                        >
                          {retestResult.isPositive ? (
                            <WarningIcon sx={{ mr: 1 }} />
                          ) : (
                            <CheckCircleIcon sx={{ mr: 1 }} />
                          )}
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {retestResult.isPositive
                              ? 'Результат положительный'
                              : 'Результат отрицательный'}
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Устройство: {retestResult.deviceId}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>

              {retestResult && (
                <Box sx={{ mt: 3 }}>
                  <Alert
                    severity={retestResult.isPositive ? 'error' : 'success'}
                    sx={{ borderRadius: 2 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {retestResult.isPositive
                        ? 'Оба теста показали положительный результат'
                        : 'Повторный тест показал отрицательный результат'}
                    </Typography>
                    <Typography variant="caption">
                      {retestResult.isPositive
                        ? 'Необходимо оформить направление на медицинское освидетельствование'
                        : 'Необходимо оформить акт о проведении тестирования'}
                    </Typography>
                  </Alert>
                </Box>
              )}
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack} sx={{ borderRadius: 2 }}>
                Назад
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmResult}
                sx={{ borderRadius: 2 }}
                color={
                  retestResult?.isPositive || (testResult?.isPositive && !retestResult)
                    ? 'error'
                    : 'primary'
                }
              >
                {retestResult?.isPositive
                  ? 'Оформить направление'
                  : !testResult?.isPositive || (retestResult && !retestResult.isPositive)
                  ? 'Оформить талон-допуск'
                  : 'Продолжить'}
              </Button>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                {documentType === 'tallon'
                  ? 'Талон-допуск'
                  : documentType === 'referral'
                  ? 'Направление на медицинское освидетельствование'
                  : documentType === 'refusalAct'
                  ? 'Акт об отказе от медицинского освидетельствования'
                  : 'Оформление документа'}
              </Typography>

              {!documentReady ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 5,
                  }}
                >
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Формирование документа...
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Paper
                        elevation={0}
                        sx={{
                          bgcolor: 'background.light',
                          p: 4,
                          borderRadius: 3,
                          minHeight: 400,
                        }}
                      >
                        {documentType === 'tallon' && (
                          <Box>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                ТАЛОН-ДОПУСК №{Math.floor(Math.random() * 10000)}
                              </Typography>
                              <Typography variant="body2">
                                на право допуска к работе по результатам алкотестирования
                              </Typography>
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 4 }}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Дата:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {testDate}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Время:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {testResult?.testTime}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Box sx={{ mb: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                Сотрудник:
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                                {selectedEmployee?.fullName}
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Табельный номер:
                                  </Typography>
                                  <Typography variant="body1">
                                    {selectedEmployee?.personalId}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Подразделение:
                                  </Typography>
                                  <Typography variant="body1">
                                    {selectedEmployee?.department}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                Результат тестирования:
                              </Typography>
                              <Box
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  p: 1,
                                  borderRadius: 2,
                                  bgcolor: 'success.light',
                                  color: 'white',
                                  mt: 1,
                                }}
                              >
                                <CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  Тест пройден успешно (
                                  {retestResult ? retestResult.value : testResult?.value}
                                  ‰)
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                Решение:
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, color: 'success.main' }}
                              >
                                Допущен к работе
                              </Typography>
                            </Box>

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Медицинский работник:
                                </Typography>
                                <Typography variant="body1">Иванова М.С.</Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Подпись:
                                </Typography>
                                <Typography variant="body1">______________</Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        )}

                        {documentType === 'referral' && (
                          <Box>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                НАПРАВЛЕНИЕ №{Math.floor(Math.random() * 10000)}
                              </Typography>
                              <Typography variant="body2">
                                на медицинское освидетельствование для установления факта
                                употребления алкоголя и состояния опьянения
                              </Typography>
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Дата:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {testDate}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Время:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {retestResult?.testTime || testResult?.testTime}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                  Место составления:
                                </Typography>
                                <Typography variant="body1">
                                  Медицинский пункт предприятия
                                </Typography>
                              </Grid>
                            </Grid>

                            <Box sx={{ mb: 3 }}>
                              <Typography variant="body2" color="text.secondary">
                                Составитель:
                              </Typography>
                              <Typography variant="body1">
                                Иванова М.С., медицинский работник
                              </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                              <Typography variant="body2" color="text.secondary">
                                Направлен на медосвидетельствование:
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, mb: 1 }}
                              >
                                {selectedEmployee?.fullName}
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Дата рождения:
                                  </Typography>
                                  <Typography variant="body1">
                                    {selectedEmployee?.birthDate}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Место работы:
                                  </Typography>
                                  <Typography variant="body1">
                                    {selectedEmployee?.department}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                              <Typography variant="body2" color="text.secondary">
                                Основания направления:
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, color: 'error.main' }}
                              >
                                Положительный результат алкотестирования
                              </Typography>
                              <Typography variant="body2">
                                Алкотестер {deviceId}, результат:{' '}
                                {(retestResult?.value || testResult?.value || 0).toFixed(2)}‰
                              </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                              <Typography variant="body2" color="text.secondary">
                                Цель освидетельствования:
                              </Typography>
                              <Typography variant="body1">
                                Установление факта употребления алкоголя и состояния
                                опьянения
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Освидетельствование:
                              </Typography>
                              <Typography variant="body1">Первичное</Typography>
                            </Box>
                          </Box>
                        )}

                        {documentType === 'refusalAct' && (
                          <Box>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                АКТ №{Math.floor(Math.random() * 10000)}
                              </Typography>
                              <Typography variant="body2">
                                об отказе от прохождения медицинского освидетельствования
                              </Typography>
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Дата:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {testDate}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Время:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {testResult?.testTime}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                  Место составления:
                                </Typography>
                                <Typography variant="body1">
                                  Медицинский пункт предприятия
                                </Typography>
                              </Grid>
                            </Grid>

                            <Box sx={{ mb: 3 }}>
                              <Typography variant="body2" color="text.secondary">
                                Мы, нижеподписавшиеся:
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                Иванова М.С., медицинский работник
                              </Typography>
                              <Typography variant="body1">
                                Петров А.В., начальник смены
                              </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                              <Typography variant="body2" color="text.secondary">
                                Составили настоящий акт о нижеследующем:
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, mb: 1 }}
                              >
                                {selectedEmployee?.fullName}, {selectedEmployee?.position},{' '}
                                {selectedEmployee?.department}
                              </Typography>
                              <Typography variant="body1">
                                был(а) направлен(а) для медицинского освидетельствования{' '}
                                {testDate}, но от прохождения освидетельствования
                                отказался(лась).
                              </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                              <Typography variant="body2" color="text.secondary">
                                Причина отказа со слов работника:
                              </Typography>
                              <Typography variant="body1">
                                Считаю проверку неправомерной
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Акт составлен в присутствии свидетелей:
                              </Typography>
                              <Typography variant="body1">
                                1. Петров А.В., начальник смены
                              </Typography>
                              <Typography variant="body1">
                                2. Сидоров И.К., специалист по охране труда
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          p: 3,
                          bgcolor: 'background.light',
                          height: '100%',
                        }}
                      >
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                          Действия с документом
                        </Typography>

                        <List>
                          <ListItem
                            sx={{
                              bgcolor: 'background.paper',
                              borderRadius: 2,
                              mb: 2,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.light' }}>
                                <PrintIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary="Распечатать документ"
                              secondary="Печать на бумажном носителе"
                            />
                            <Button variant="outlined" size="small">
                              Печать
                            </Button>
                          </ListItem>

                          <ListItem
                            sx={{
                              bgcolor: 'background.paper',
                              borderRadius: 2,
                              mb: 2,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'secondary.light' }}>
                                <AssignmentIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary="Сохранить в журнал"
                              secondary="Запись в электронном журнале"
                            />
                            <Button variant="outlined" size="small">
                              Сохранить
                            </Button>
                          </ListItem>

                          <ListItem
                            sx={{
                              bgcolor: 'background.paper',
                              borderRadius: 2,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'tertiary.main' }}>
                                <DownloadIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary="Скачать PDF"
                              secondary="Сохранить документ локально"
                            />
                            <Button variant="outlined" size="small">
                              Скачать
                            </Button>
                          </ListItem>
                        </List>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack} sx={{ borderRadius: 2 }}>
                Назад
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReset}
                sx={{ borderRadius: 2 }}
              >
                Завершить и начать новый тест
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Алкотестирование
        </Typography>
      </Box>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          mb: 4,
          '& .MuiStepConnector-line': {
            minHeight: 12,
          },
          '& .MuiStepLabel-root': {
            '& .MuiStepIcon-text': {
              fill: 'white',
            },
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}

      {/* Диалог подтверждения */}
      <Dialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Сотрудник отказывается от повторного теста?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Первый тест показал положительный результат, но повторный тест не был проведен.
            Выберите дальнейшее действие:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                color="error"
                onClick={handleCreateRefusalAct}
                sx={{ p: 2, borderRadius: 2, height: '100%' }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <CancelIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2">
                    Оформить акт об отказе от медосвидетельствования
                  </Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleContinueWithoutRetest}
                sx={{ p: 2, borderRadius: 2, height: '100%' }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2">
                    Оформить направление на основании первого теста
                  </Typography>
                </Box>
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setIsConfirmDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Testing;