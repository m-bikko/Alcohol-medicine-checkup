import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { employees, departments } from '../../mock/data';
import { Employee } from '../../types';
import { getEmployeeCSVTemplate } from '../../utils/csvUtils';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.background.default,
    borderRadius: 8,
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDataGrid-footerContainer': {
    backgroundColor: theme.palette.background.paper,
    borderTop: 'none',
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-row': {
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    },
  },
}));

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleDepartmentChange = (event: SelectChangeEvent) => {
    setSelectedDepartment(event.target.value);
    handleFilterClose();
  };

  const handleClearFilters = () => {
    setSelectedDepartment('');
    handleFilterClose();
  };

  const handleUploadDialogOpen = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setIsUploadDialogOpen(false);
    setUploadFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadFile(event.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    // В реальном приложении здесь будет логика загрузки файла
    handleUploadDialogClose();
  };

  const downloadCSVTemplate = () => {
    const template = getEmployeeCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Фильтрация сотрудников
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.personalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment
      ? employee.department === selectedDepartment
      : true;

    return matchesSearch && matchesDepartment;
  });

  const columns: GridColDef[] = [
    {
      field: 'personalId',
      headerName: 'Табельный номер',
      width: 140,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
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
      field: 'birthDate',
      headerName: 'Дата рождения',
      width: 130,
    },
    {
      field: 'department',
      headerName: 'Подразделение',
      width: 200,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: 'background.default',
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      ),
    },
    {
      field: 'lastMedicalExamDate',
      headerName: 'Последний медосмотр',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Box sx={{ display: 'flex' }}>
          <Tooltip title="Просмотр">
            <IconButton size="small" sx={{ mr: 0.5 }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Редактировать">
            <IconButton size="small" sx={{ mr: 0.5 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Удалить">
            <IconButton size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Сотрудники
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ ml: 1, borderRadius: 2 }}
          >
            Добавить сотрудника
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
            placeholder="Поиск сотрудника..."
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
              sx={{ borderRadius: 2, mr: 1 }}
            >
              Фильтры
              {selectedDepartment && (
                <Chip
                  label={selectedDepartment}
                  size="small"
                  sx={{ ml: 1, fontWeight: 500, fontSize: '0.75rem' }}
                />
              )}
            </Button>

            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              PaperProps={{
                elevation: 3,
                sx: { width: 250, maxHeight: 400, borderRadius: 2, mt: 1 },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Подразделение
                </Typography>
                <FormControl size="small" fullWidth>
                  <InputLabel id="department-select-label">Выберите подразделение</InputLabel>
                  <Select
                    labelId="department-select-label"
                    id="department-select"
                    value={selectedDepartment}
                    label="Выберите подразделение"
                    onChange={handleDepartmentChange}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleClearFilters} size="small">
                  Сбросить фильтры
                </Button>
              </Box>
            </Menu>

            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={handleUploadDialogOpen}
              size="medium"
              sx={{ borderRadius: 2, mr: 1 }}
            >
              Загрузить CSV
            </Button>

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={downloadCSVTemplate}
              size="medium"
              sx={{ borderRadius: 2 }}
            >
              Скачать шаблон
            </Button>
          </Box>
        </Box>

        {selectedDepartment && (
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Chip
              label={`Подразделение: ${selectedDepartment}`}
              onDelete={handleClearFilters}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
          </Box>
        )}
      </Paper>

      <Paper
        sx={{
          height: 600,
          width: '100%',
          p: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          '& .MuiDataGrid-root': {
            border: 'none',
          },
        }}
      >
        <StyledDataGrid
          rows={filteredEmployees}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'fullName', sort: 'asc' }],
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
              csvOptions: { disableToolbarButton: true },
              printOptions: { disableToolbarButton: true },
            },
          }}
        />
      </Paper>

      {/* Диалог загрузки CSV файла */}
      <Dialog
        open={isUploadDialogOpen}
        onClose={handleUploadDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 600,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Загрузка списка сотрудников
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Загрузите CSV-файл со списком сотрудников. Файл должен соответствовать формату шаблона.
          </Typography>

          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              mb: 3,
            }}
          >
            <UploadIcon fontSize="large" color="primary" sx={{ mb: 1 }} />
            <Typography variant="body2" sx={{ mb: 2 }}>
              Перетащите сюда файл или
            </Typography>
            <Button
              variant="outlined"
              component="label"
              sx={{ mb: 1 }}
            >
              Выбрать файл
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileChange}
              />
            </Button>
            {uploadFile && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={uploadFile.name}
                  color="primary"
                  variant="outlined"
                  onDelete={() => setUploadFile(null)}
                />
              </Box>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            Допустимые форматы: .CSV
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Максимальный размер файла: 10MB
          </Typography>

          <Button
            variant="text"
            startIcon={<DownloadIcon />}
            onClick={downloadCSVTemplate}
            size="small"
          >
            Скачать шаблон для заполнения
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleUploadDialogClose} variant="outlined" sx={{ borderRadius: 2 }}>
            Отмена
          </Button>
          <Button
            onClick={handleFileUpload}
            variant="contained"
            sx={{ borderRadius: 2 }}
            disabled={!uploadFile}
          >
            Загрузить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees;