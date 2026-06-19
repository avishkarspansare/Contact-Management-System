import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CategoryTag from "./CategoryTag";

/**
 * Desktop-friendly table view of all (filtered) contacts.
 * Hidden below the `sm` breakpoint in favor of ContactCardList.
 */
const ContactTable = ({ contacts, onEdit, onDelete }) => {
  if (contacts.length === 0) {
    return null; // empty state handled by parent
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(26,35,50,0.03)" }}>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {contact.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <PhoneOutlinedIcon fontSize="inherit" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2">{contact.phoneNumber}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                {contact.email ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <EmailOutlinedIcon fontSize="inherit" sx={{ color: "text.secondary" }} />
                    <Typography variant="body2">{contact.email}</Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    —
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <CategoryTag category={contact.category} />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit(contact)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => onDelete(contact)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContactTable;
