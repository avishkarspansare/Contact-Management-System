import { Card, CardContent, Typography, Box, IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CategoryTag from "./CategoryTag";

/**
 * Card-based layout used on narrow screens instead of ContactTable,
 * which doesn't degrade gracefully below ~600px.
 */
const ContactCardList = ({ contacts, onEdit, onDelete }) => {
  return (
    <Stack spacing={1.5}>
      {contacts.map((contact) => (
<<<<<<< HEAD
        <Card key={contact.id} variant="outlined" sx={{ borderRadius: 0 }}>
=======
        <Card key={contact.id} variant="outlined" sx={{ borderRadius: 2 }}>
>>>>>>> 14cdaac30026e5a1de02c60386f83a415250116c
          <CardContent sx={{ pb: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {contact.name}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <CategoryTag category={contact.category} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton size="small" onClick={() => onEdit(contact)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => onDelete(contact)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Stack spacing={0.5} sx={{ mt: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="body2">{contact.phoneNumber}</Typography>
              </Box>
              {contact.email && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2">{contact.email}</Typography>
                </Box>
              )}
              {contact.address && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PlaceOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2">{contact.address}</Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default ContactCardList;
