import { Snackbar, Alert } from "@mui/material";

/**
 * Single shared snackbar for success/error feedback across the app
 * (create, update, delete, fetch failures). The parent controls
 * `notification` as { message, severity } | null.
 */
const NotificationSnackbar = ({ notification, onClose }) => {
  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={3500}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={notification?.severity || "info"}
        variant="filled"
        sx={{ minWidth: 280 }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
