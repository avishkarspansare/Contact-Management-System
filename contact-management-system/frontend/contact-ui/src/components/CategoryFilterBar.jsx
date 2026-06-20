import { Stack, Chip } from "@mui/material";
import { CATEGORY_OPTIONS, getCategoryColor } from "../theme/categoryColors";

/**
 * Row of filter chips above the contact list. "All" plus one chip
 * per category. The selected chip is filled with that category's
 * accent color; the rest stay outlined.
 */
const CategoryFilterBar = ({ activeCategory, onCategoryChange }) => {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
      <Chip
        label="All"
        onClick={() => onCategoryChange("All")}
        variant={activeCategory === "All" ? "filled" : "outlined"}
        sx={{
          backgroundColor: activeCategory === "All" ? "secondary.main" : "transparent",
          color: activeCategory === "All" ? "white" : "text.secondary",
          borderColor: "secondary.main",
<<<<<<< HEAD
          borderRadius: 0,
=======
>>>>>>> 14cdaac30026e5a1de02c60386f83a415250116c
        }}
      />
      {CATEGORY_OPTIONS.map((cat) => {
        const color = getCategoryColor(cat);
        const isActive = activeCategory === cat;
        return (
          <Chip
            key={cat}
            label={cat}
            onClick={() => onCategoryChange(cat)}
            variant={isActive ? "filled" : "outlined"}
            sx={{
              backgroundColor: isActive ? color : "transparent",
              color: isActive ? "white" : color,
              borderColor: color,
<<<<<<< HEAD
              borderRadius: 0,
=======
>>>>>>> 14cdaac30026e5a1de02c60386f83a415250116c
            }}
          />
        );
      })}
    </Stack>
  );
};

export default CategoryFilterBar;
