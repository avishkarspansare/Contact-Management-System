/**
 * Maps a contact category to a distinct accent color.
 * Used for the category "tag" badge that appears in the table,
 * cards, and the add/edit dialog -- the app's one recurring
 * visual signature.
 */
export const CATEGORY_COLORS = {
  Work: "#C77B5E",
  Family: "#4A7862",
  Friends: "#5B7DB1",
  Personal: "#9C6FB0",
  General: "#8A8F98",
};

export const getCategoryColor = (category) =>
  CATEGORY_COLORS[category] || CATEGORY_COLORS.General;

export const CATEGORY_OPTIONS = ["General", "Work", "Family", "Friends", "Personal"];
