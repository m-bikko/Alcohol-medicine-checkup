import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon,
  Print as PrintIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowDropDown as ArrowDropDownIcon,
  CalendarMonth as CalendarMonthIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { alcoholTests, employees, departments } from '../../mock/data';
import { AlcoholTest, Employee } from '../../types';
import { formatDate } from '../../utils/formatUtils';

// Объединяем данные о тестах с данными о сотрудниках
const getTestsWithEmployeeInfo = () => {
  return alcoholTests.map((test) => {
    const employee = employees.find((e) => e.id === test.employeeId);
    return {
      ...test,
      employeeName: employee?.fullName || '',
      employeeId: employee?.personalId || '',
      department: employee?.department || '',
      position: employee?.position || '',
    };
  });
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.default,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.background.light,
  },
}));

const AlcoholTestJournal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<(AlcoholTest & {
    employeeName: string;
    employeeId: string;
    department: string;
    position: string;
  }) | null>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleDepartmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedDepartment(event.target.value as string);
  };

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
  };

  const handleClearFilters = () => {
    setSelectedDepartment('');
    setSelectedDate(null);
    setSearchTerm('');
    handleFilterClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewTest = (test: AlcoholTest & {
    employeeName: string;
    employeeId: string;
    department: string;
    position: string;
  }) => {
    setSelectedTest(test);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  // Фильтрация тестов
  const testsWithEmployeeInfo = getTestsWithEmployeeInfo();
  const filteredTests = testsWithEmployeeInfo.filter((test) => {
    const matchesSearch =
      test.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment
      ? test.department === selectedDepartment
      : true;

    const matchesDate = selectedDate
      ? test.testDate === formatDate(selectedDate)
      : true;

    return matchesSearch && matchesDepartment && matchesDate;
  });

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Журнал алкотестирования
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            sx={{ mr: 1, borderRadius: 2 }}
          >
            Печать
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{ borderRadius: 2 }}
          >
            Экспорт
          </Button>
        </Box>
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Поиск по ФИО, табельному номеру или подразделению..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: '250px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Box>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              endIcon={<ArrowDropDownIcon />}
              onClick={handleFilterClick}
              size="medium"
              sx={{ borderRadius: 2 }}
            >
              Фильтры
              {(selectedDepartment || selectedDate) && (
                <Box component="span" sx={{ ml: 1 }}>
                  <Chip
                    size="small"
                    label={`Фильтры: ${selectedDepartment ? 1 : 0}${
                      selectedDate ? 1 : 0
                    }`}
                    color="primary"
                  />
                </Box>
              )}
            </Button>

            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              PaperProps={{
                elevation: 3,
                sx: { width: 300, maxHeight: 400, borderRadius: 2, mt: 1 },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Подразделение
                </Typography>
                <FormControl size="small" fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="department-select-label">Выберите подразделение</InputLabel>
                  <Select
                    labelId="department-select-label"
                    id="department-select"
                    value={selectedDepartment}
                    label="Выберите подразделение"
                    onChange={handleDepartmentChange as any}
                  >
                    <MenuItem value="">Все подразделения</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Дата тестирования
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                  <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarMonthIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </LocalizationProvider>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={handleClearFilters} size="small">
                    Сбросить фильтры
                  </Button>
                </Box>
              </Box>
            </Menu>
          </Box>
        </Box>

        {(selectedDepartment || selectedDate) && (
          <Box sx={{ display: 'flex', mb: 2 }}>
            {selectedDepartment && (
              <Chip
                label={`Подразделение: ${selectedDepartment}`}
                onDelete={() => setSelectedDepartment('')}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
              />
            )}
            {selectedDate && (
              <Chip
                label={`Дата: ${formatDate(selectedDate)}`}
                onDelete={() => setSelectedDate(null)}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="журнал алкотестирования">
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>№ п/п</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Дата</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Время</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ФИО сотрудника</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Табельный номер</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Подразделение</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Результат</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((test, index) => (
                  <StyledTableRow key={test.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{test.testDate}</TableCell>
                    <TableCell>{test.testTime}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {test.employeeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {test.position}
                      </Typography>
                    </TableCell>
                    <TableCell>{test.employeeId}</TableCell>
                    <TableCell>{test.department}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          test.isPositive
                            ? `Положительный (${test.result.toFixed(2)} ‰)`
                            : `Отрицательный (${test.result.toFixed(2)} ‰)`
                        }
                        color={test.isPositive ? 'error' : 'success'}
                        size="small"
                        sx={{ fontWeight: 500 }}
                        icon={
                          test.isPositive ? (
                            <WarningIcon sx={{ fontSize: '1rem !important' }} />
                          ) : (
                            <CheckCircleIcon sx={{ fontSize: '1rem !important' }} />
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Просмотр">
                        <IconButton size="small" onClick={() => handleViewTest(test)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Редактировать">
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Печать">
                        <IconButton size="small">
                          <PrintIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}`
          }
        />
      </Paper>

      {/* Диалог просмотра теста */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Детали алкотестирования
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedTest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Информация о сотруднике
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          ФИО:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedTest.employeeName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Табельный номер:
                        </Typography>
                        <Typography variant="body1">{selectedTest.employeeId}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Подразделение:
                        </Typography>
                        <Typography variant="body1">{selectedTest.department}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Должность:
                        </Typography>
                        <Typography variant="body1">{selectedTest.position}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    mb: 3,
                    borderColor: selectedTest.isPositive ? 'error.light' : 'success.light',
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Результаты тестирования
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Дата:
                        </Typography>
                        <Typography variant="body1">{selectedTest.testDate}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Время:
                        </Typography>
                        <Typography variant="body1">{selectedTest.testTime}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Результат (‰):
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: selectedTest.isPositive ? 'error.main' : 'success.main',
                            fontWeight: 500,
                          }}
                        >
                          {selectedTest.result.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Статус:
                        </Typography>
                        <Chip
                          label={selectedTest.isPositive ? 'Положительный' : 'Отрицательный'}
                          color={selectedTest.isPositive ? 'error' : 'success'}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          ID устройства:
                        </Typography>
                        <Typography variant="body1">{selectedTest.deviceId}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Смена №:
                        </Typography>
                        <Typography variant="body1">{selectedTest.shiftNumber}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {selectedTest.comments && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                        Комментарии
                      </Typography>
                      <Typography variant="body1">{selectedTest.comments}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseViewDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            Закрыть
          </Button>
          <Button variant="contained" startIcon={<PrintIcon />} sx={{ borderRadius: 2 }}>
            Печать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlcoholTestJournal;