import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";

/**
 * Simple confirmation dialog before a delete actually fires.
 * Keeps the destructive action behind one extra deliberate click.
 */
const DeleteConfirmDialog = ({ open, onClose, onConfirm, contactName }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete contact?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          This will permanently remove <strong>{contactName}</strong> from your contacts. This
          action can't be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
