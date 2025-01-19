import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { Adjustments as AdjustmentsIcon } from '../../icons/adjustments';

export const RecordsFilter = (props) => {
  const { mode, onModeChange, onFilterApply, query, onQueryChange } = props;

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    if (onFilterApply) {
      onFilterApply();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleFilterSubmit}
      sx={{
        alignItems: 'center',
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          sm: '1fr auto auto',
          xs: 'auto'
        },
        p: 3
      }}
    >
      {/* Search Query Input */}
      <TextField
        label="Search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        variant="outlined"
        size="small"
        sx={{
          gridColumn: {
            sm: 'span 1',
            xs: 'span 2'
          }
        }}
      />

      {/* Toggle Buttons for Display Modes */}
      <ToggleButtonGroup
        exclusive
        onChange={onModeChange}
        size="small"
        value={mode}
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          p: 0.5,
          '& .MuiToggleButton-root': {
            color: 'rgba(35, 45, 55, 0.6)',
            border: 0,
            '&:not(:first-of-type)': {
              borderRadius: 1
            },
            '&:first-of-type': {
              borderRadius: 1,
              mr: 0.5
            }
          }
        }}
      >
        <ToggleButton value="table">
          Table View
        </ToggleButton>
        <ToggleButton value="grid">
          Grid View
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Filter Button */}
      <Button
        type="submit"
        color="primary"
        startIcon={<AdjustmentsIcon />}
        variant="contained"
        size="large"
        sx={{ alignSelf: 'center' }}
      >
        Apply Filters
      </Button>
    </Box>
  );
};

RecordsFilter.defaultProps = {
  mode: 'table'
};

RecordsFilter.propTypes = {
  mode: PropTypes.oneOf(['table', 'grid']),
  onModeChange: PropTypes.func,
  onFilterApply: PropTypes.func,
  query: PropTypes.string,
  onQueryChange: PropTypes.func
};
