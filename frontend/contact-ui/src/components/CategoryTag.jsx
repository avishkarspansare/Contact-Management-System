import { Box, Typography } from "@mui/material";
import { getCategoryColor } from "../theme/categoryColors";

/**
 * The recurring "tag" badge used everywhere a category appears:
 * table rows, contact cards, and the edit dialog preview.
 * A small left accent bar in the category's color, rather than a
 * filled chip, keeps it quiet but still gives every category an
 * identifiable visual signature throughout the app.
 */
const CategoryTag = ({ category }) => {
  const color = getCategoryColor(category);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        pl: 1,
        pr: 1.25,
        py: 0.4,
        borderRadius: "6px",
        borderLeft: `3px solid ${color}`,
        backgroundColor: `${color}14`,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          color: color,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          fontSize: "0.7rem",
        }}
      >
        {category || "General"}
      </Typography>
    </Box>
  );
};

export default CategoryTag;
