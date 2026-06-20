import { Box, Typography, Button } from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SearchOffIcon from "@mui/icons-material/SearchOff";

/**
 * Shown either when there are no contacts at all (variant="empty")
 * or when a search/filter produced zero results (variant="no-results").
 * Each tells the user what happened and what to do next, rather than
 * just showing a blank space.
 */
const EmptyState = ({ variant = "empty", onAddContact, onClearFilters }) => {
  if (variant === "no-results") {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <SearchOffIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
        <Typography variant="h6" gutterBottom>
          No contacts match that search
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Try a different name, phone number, or category filter.
        </Typography>
        <Button variant="outlined" onClick={onClearFilters}>
          Clear filters
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <PersonAddAltIcon sx={{ fontSize: 48, color: "primary.main", mb: 1.5 }} />
      <Typography variant="h6" gutterBottom>
        No contacts yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Add your first contact to get started.
      </Typography>
      <Button variant="contained" onClick={onAddContact}>
        Add contact
      </Button>
    </Box>
  );
};

export default EmptyState;
