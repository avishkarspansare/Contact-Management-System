import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CATEGORY_OPTIONS } from "../theme/categoryColors";

const EMPTY_FORM = {
  name: "",
  phoneNumber: "",
  email: "",
  address: "",
  category: "General",
};

/**
 * Modal used for both "Add Contact" and "Edit Contact".
 * `initialData` being null/undefined means "create" mode;
 * passing an existing contact switches it to "edit" mode.
 *
 * Client-side validation mirrors the backend's Bean Validation rules
 * so the user gets instant feedback, but the backend remains the
 * source of truth (it re-validates on every request regardless).
 */
const ContactFormDialog = ({ open, onClose, onSubmit, initialData, submitError }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    // Resets the local form state whenever the dialog opens or switches
    // between create/edit mode. This genuinely needs to run as a side
    // effect of `initialData`/`open` changing, not during render, since
    // it's resetting local state in response to a prop change.
    const nextForm = initialData
      ? {
          name: initialData.name || "",
          phoneNumber: initialData.phoneNumber || "",
          email: initialData.email || "",
          address: initialData.address || "",
          category: initialData.category || "General",
        }
      : EMPTY_FORM;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(nextForm);
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const next = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = "Name must be at least 2 characters";
    }

    const phonePattern = /^[+]?[0-9]{7,15}$/;
    if (!phonePattern.test(form.phoneNumber.trim())) {
      next.phoneNumber = "Enter 7-15 digits, optionally starting with +";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {isEditMode ? "Edit contact" : "Add new contact"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Full name"
              name="cms-field-a1"
              id="cms-field-a1"
              value={form.name}
              onChange={handleChange("name")}
              error={Boolean(errors.name)}
              helperText={errors.name}
              fullWidth
              autoFocus
              autoComplete="off"
            />

            <TextField
              label="Phone number"
              name="cms-field-a2"
              id="cms-field-a2"
              value={form.phoneNumber}
              onChange={handleChange("phoneNumber")}
              error={Boolean(errors.phoneNumber)}
              helperText={errors.phoneNumber || "Digits only, e.g. 9876543210"}
              fullWidth
              autoComplete="off"
            />

            <TextField
              label="Email (optional)"
              name="cms-field-a3"
              id="cms-field-a3"
              value={form.email}
              onChange={handleChange("email")}
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
              autoComplete="off"
            />

            <TextField
              label="Address (optional)"
              name="cms-field-a4"
              id="cms-field-a4"
              value={form.address}
              onChange={handleChange("address")}
              fullWidth
              multiline
              minRows={2}
              autoComplete="off"
            />

            <TextField
              select
              label="Category"
              value={form.category}
              onChange={handleChange("category")}
              fullWidth
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            {submitError && (
              <Typography variant="body2" color="error">
                {submitError}
              </Typography>
            )}
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditMode ? "Save changes" : "Add contact"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactFormDialog;
