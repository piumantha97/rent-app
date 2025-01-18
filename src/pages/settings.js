import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  FormHelperText,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';

const companySizeOptions = ['1-10', '11-30', '31-50', '50+'];
const placesOptions = ['B1-0','B1-2', 'B1-3', 'B1-4','B2-0','B2-1', 'B2-2', 'B2-3', ];

export const Settings = () => {
  const formik = useFormik({
    initialValues: {
      // companyName: 'ACME Corp LLC.',
      // companySize: '1-10',
      keyMoney: '10000',
      fullName: 'Chen Simmons',
      // jobTitle: 'Operation',
      // submit: null
    },
    validationSchema: Yup.object().shape({
      // companyName: Yup.string().max(255).required('Company name is required'),
      // companySize: Yup
      //   .string()
      //   .max(255)
      //   .oneOf(companySizeOptions)
      //   .required('Company size is required'),
      keyMoney: Yup.string().max(255).required('Key money is required'),
      fullName: Yup.string().max(255).required('Full Name is required'),
      // telephone: Yup.string()
      // .required('Telephone Number is required'),
      monthlyRent: Yup.number()
      .required('Monthly Rent is required')
      .min(0, 'Monthly Rent cannot be negative'),
      // jobTitle: Yup.string().max(255).required('Job name is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
           // Send a POST request to your backend API
    const response = await axios.post('http://localhost:5000/api/property', values);
    
    console.log('Response:', response.data);

        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        alert('Form submitted successfully!');
      } catch (err) {
        console.error(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        alert('Failed to submit the form. Please try again.');
      }
    }
  });

  return (
    <>
      <Helmet>
        <title>Settings | Carpatin Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          pb: 3,
          pt: 8
        }}
      >
        <Container maxWidth="lg">
          <Typography
            color="textPrimary"
            sx={{ mb: 3 }}
            variant="h4"
          >
            Settings
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography
                color="textPrimary"
                variant="h6"
              >
                 test 
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Card
                variant="outlined"
                sx={{ p: 3 }}
              >
                <form onSubmit={formik.handleSubmit}>
                  <div>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        pb: 3
                      }}
                    >
                      <Avatar
                        src="/static/user-chen_simmons.png"
                        sx={{
                          height: 64,
                          mr: 2,
                          width: 64
                        }}
                      />
                      <div>
                        <Button
                          color="primary"
                          size="small"
                          sx={{ mb: 1 }}
                          type="button"
                          variant="outlined"
                        >
                          Upload new picture
                        </Button>
                        <div>
                          <Typography
                            color="textSecondary"
                            variant="caption"
                          >
                            Recommended dimensions: 200x200, maximum file size: 5MB
                          </Typography>
                        </div>
                      </div>
                    </Box>
                    <Grid
                      container
                      spacing={2}
                      sx={{ maxWidth: 420 }}
                    >

<Grid
                        item
                        xs={12}
                      >
                        <TextField
                          error={Boolean(formik.touched.companySize && formik.errors.companySize)}
                          fullWidth
                          helperText={formik.touched.companySize && formik.errors.companySize}
                          label="Place Code"
                          name="placeCode"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          select
                          value={formik.values.companySize}
                          variant="outlined"
                        >
                          {placesOptions.map((placesOption) => (
                            <MenuItem
                              key={placesOption}
                              value={placesOption}
                            >
                              {placesOption}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                      >
                        <TextField
                          error={Boolean(formik.touched.businessName && formik.errors.businessName)}
                          fullWidth
                          helperText={formik.touched.businessName && formik.errors.businessName}
                          label="Business Name"
                          name="businessName"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.businessName}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                      >
                        <TextField
                          error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                          fullWidth
                          helperText={formik.touched.fullName && formik.errors.fullName}
                          label="Full Name"
                          name="fullName"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.fullName}
                          variant="outlined"
                        />
                      </Grid>
                      {/* <Grid item xs={12}>
                      <TextField
                        error={Boolean(formik.touched.telephone && formik.errors.telephone)}
                        fullWidth
                        helperText={formik.touched.telephone && formik.errors.telephone}
                        label="Telephone Number"
                        name="telephone"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.telephone}
                        variant="outlined"
                        type="tel"
                        inputProps={{
                          pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}", // Example pattern for US phone numbers
                          title: "Enter a phone number in the format: 123-456-7890",
                        }}
                      />
                    </Grid> */}
                      <Grid item xs={12}>
                      <TextField
                        error={Boolean(formik.touched.startDate && formik.errors.startDate)}
                        fullWidth
                        helperText={formik.touched.startDate && formik.errors.startDate}
                        label="Start Date"
                        name="startDate"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="date"
                        value={formik.values.startDate}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true, // Ensures the label stays visible when a date is selected
                        }}
                      />
                    </Grid>
                      <Grid item xs={12}>
                      <TextField
                        error={Boolean(formik.touched.endDate && formik.errors.endDate)}
                        fullWidth
                        helperText={formik.touched.endDate && formik.errors.endDate}
                        label="End Date"
                        name="endDate"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="date"
                        value={formik.values.endDate}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true, // Ensures the label stays visible when a date is selected
                        }}
                      />
                    </Grid>
                      <Grid
                        item
                        xs={12}
                      >
                        <TextField
                          error={Boolean(formik.touched.keyMoney && formik.errors.email)}
                          fullWidth
                          helperText={formik.touched.email && formik.errors.email}
                          label="Key Money"
                          name="keyMoney"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="keyMoney"
                          value={formik.values.keyMoney}
                          variant="outlined"
                        />
                      </Grid>

                    <Grid item xs={12}>
                    <TextField
                      error={Boolean(formik.touched.monthlyRent && formik.errors.monthlyRent)}
                      fullWidth
                      helperText={formik.touched.monthlyRent && formik.errors.monthlyRent}
                      label="Monthly Rent"
                      name="monthlyRent"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.monthlyRent}
                      variant="outlined"
                      type="number"
                      inputProps={{
                        min: 0, // Ensures no negative numbers can be entered
                        step: "any", // Allows for decimal values if needed
                      }}
                    />
                  </Grid>
                      {formik.errors.submit && (
                        <Grid
                          item
                          xs={12}
                        >
                          <FormHelperText error>
                            {formik.errors.submit}
                          </FormHelperText>
                        </Grid>
                      )}
                      <Grid
                        item
                        xs={12}
                      >
                        <Button
                          color="primary"
                          size="large"
                          type="submit"
                          variant="contained"
                        >
                          Save settings
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </form>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
