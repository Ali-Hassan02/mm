import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';

const PolicyPopup = () => {
  const [open, setOpen] = useState(false);
  const [conditions, setConditions] = useState([
    { attribute: '', operator: '', value: '', logicalOperator: '' }, // Including logicalOperator for conditions
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConditionChange = (index, field, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][field] = value;
    setConditions(updatedConditions);
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      { attribute: '', operator: '', value: '', logicalOperator: '' }, // New condition with logicalOperator
    ]);
  };

  const removeCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  return (
    <div>
      {/* Button to open the modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Policy
      </Button>

      {/* Dialog (Popup) */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>User Set</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Name"
              placeholder="Engineering Manager Based in the USA"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              placeholder="Enter description here"
              multiline
              rows={2}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Users matching these conditions will belong to the user set:
            </Typography>

            {conditions.map((condition, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                {/* Logical Operator on the left */}
                {index > 0 && (
                  <Grid item xs={2}>
                    <FormControl fullWidth>
                      <InputLabel>Logical Operator</InputLabel>
                      <Select
                        value={condition.logicalOperator}
                        onChange={(e) =>
                          handleConditionChange(index, 'logicalOperator', e.target.value)
                        }
                      >
                        <MenuItem value="and">AND</MenuItem>
                        <MenuItem value="or">OR</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Attribute</InputLabel>
                    <Select
                      value={condition.attribute}
                      onChange={(e) =>
                        handleConditionChange(index, 'attribute', e.target.value)
                      }
                    >
                      <MenuItem value="location">Location</MenuItem>
                      <MenuItem value="age">Age</MenuItem>
                      <MenuItem value="role">Role</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={condition.operator}
                      onChange={(e) =>
                        handleConditionChange(index, 'operator', e.target.value)
                      }
                    >
                      <MenuItem value="equals">Equals</MenuItem>
                      <MenuItem value="not_equals">Not Equals</MenuItem>
                      <MenuItem value="greater_than">Greater Than</MenuItem>
                      <MenuItem value="less_than">Less Than</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    placeholder="Value"
                    value={condition.value}
                    onChange={(e) =>
                      handleConditionChange(index, 'value', e.target.value)
                    }
                  />
                </Grid>

                {/* Remove Condition Button */}
                <Grid item xs={1}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeCondition(index)}
                  >
                    X
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button variant="text" onClick={addCondition}>
              + Add Condition
            </Button>
          </Box>

          <Box textAlign="right">
            <Button onClick={handleClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Save User Set
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PolicyPopup;
