import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Stack,
  Button,
  CircularProgress,
  Typography,
  Fab,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import AppHeader from "./components/AppHeader";
import CategoryFilterBar from "./components/CategoryFilterBar";
import ContactTable from "./components/ContactTable";
import ContactCardList from "./components/ContactCardList";
import ContactFormDialog from "./components/ContactFormDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import EmptyState from "./components/EmptyState";
import NotificationSnackbar from "./components/NotificationSnackbar";

import { contactApi } from "./api/contactApi";

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formError, setFormError] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  const isMobile = useMediaQuery("(max-width:639px)");

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await contactApi.getAll();
      setContacts(data);
    } catch {
      setLoadError(
        "Couldn't reach the backend. Make sure the Spring Boot API is running on localhost:8080."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount: intentional, this is the initial data load, not a
    // derived-state sync that could be replaced with a render-time computation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContacts();
  }, [fetchContacts]);

  // Client-side filtering once contacts are loaded. For a dataset this size
  // (a personal contact book) this is simpler and snappier than round-tripping
  // to the /search endpoint on every keystroke; the backend search/filter
  // endpoints are still there and exercised by the Postman collection.
  const filteredContacts = useMemo(() => {
    let result = contacts;

    if (activeCategory !== "All") {
      result = result.filter((c) => c.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.phoneNumber.includes(term) ||
          (c.email && c.email.toLowerCase().includes(term))
      );
    }

    return result;
  }, [contacts, activeCategory, searchTerm]);

  const handleOpenAddForm = () => {
    setEditingContact(null);
    setFormError(null);
    setFormOpen(true);
  };

  const handleOpenEditForm = (contact) => {
    setEditingContact(contact);
    setFormError(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingContact(null);
    setFormError(null);
  };

  const handleFormSubmit = async (formData) => {
    setFormError(null);
    try {
      if (editingContact) {
        const updated = await contactApi.update(editingContact.id, formData);
        setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setNotification({ message: "Contact updated", severity: "success" });
      } else {
        const created = await contactApi.create(formData);
        setContacts((prev) => [...prev, created]);
        setNotification({ message: "Contact added", severity: "success" });
      }
      setFormOpen(false);
      setEditingContact(null);
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      setFormError(backendMessage || "Something went wrong. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await contactApi.delete(deleteTarget.id);
      setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setNotification({ message: "Contact deleted", severity: "success" });
    } catch {
      setNotification({ message: "Couldn't delete contact. Try again.", severity: "error" });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setActiveCategory("All");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      );
    }

    if (loadError) {
      return (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" gutterBottom color="error">
            {loadError}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchContacts}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Box>
      );
    }

    if (contacts.length === 0) {
      return <EmptyState variant="empty" onAddContact={handleOpenAddForm} />;
    }

    if (filteredContacts.length === 0) {
      return <EmptyState variant="no-results" onClearFilters={handleClearFilters} />;
    }

    return isMobile ? (
      <ContactCardList
        contacts={filteredContacts}
        onEdit={handleOpenEditForm}
        onDelete={setDeleteTarget}
      />
    ) : (
      <ContactTable
        contacts={filteredContacts}
        onEdit={handleOpenEditForm}
        onDelete={setDeleteTarget}
      />
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalContacts={contacts.length}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <CategoryFilterBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {!isMobile && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddForm}
              sx={{ flexShrink: 0 }}
            >
              Add contact
            </Button>
          )}
        </Stack>

        {renderContent()}
      </Container>

      {isMobile && (
        <Fab
          color="primary"
          onClick={handleOpenAddForm}
          sx={{ position: "fixed", bottom: 24, right: 24 }}
        >
          <AddIcon />
        </Fab>
      )}

      <ContactFormDialog
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingContact}
        submitError={formError}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        contactName={deleteTarget?.name}
      />

      <NotificationSnackbar notification={notification} onClose={() => setNotification(null)} />
    </Box>
  );
}

export default App;
