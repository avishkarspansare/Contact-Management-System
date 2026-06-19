import { AppBar, Toolbar, Typography, Box, TextField, InputAdornment, Stack, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

/**
 * Top app bar: brand mark, search field, and a quick contact count.
 * Search is controlled from here and bubbled up via onSearchChange
 * so the parent (App) owns the actual filtering state.
 */
const AppHeader = ({ searchTerm, onSearchChange, totalContacts }) => {
  return (
    <AppBar position="static" color="secondary" elevation={0}>
      <Toolbar sx={{ py: 1.5, gap: 2, flexWrap: "wrap" }}>
        <Stack direction="row" spacing={1.25} sx={{ flexShrink: 0, alignItems: "center" }}>
          <ContactPhoneIcon sx={{ color: "primary.main", fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
              Contact Manager
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
              TechnoHacks Internship · Advanced Task
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <TextField
          size="small"
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            minWidth: { xs: "100%", sm: 320 },
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
            },
            "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.5)" },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Chip
          label={`${totalContacts} contact${totalContacts === 1 ? "" : "s"}`}
          sx={{
            backgroundColor: "rgba(199,123,94,0.18)",
            color: "primary.light",
            fontWeight: 700,
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
