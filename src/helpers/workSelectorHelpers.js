export const getDefaultCategory = (categories) => {
  return categories.length ? categories[0].category : null;
};

export const getCurrentCategoryObj = (works, currentCategory) => {
  if (!currentCategory) return null;
  return works.find(
    (cat) =>
      cat.category.trim().toLowerCase() === currentCategory.trim().toLowerCase()
  );
};
