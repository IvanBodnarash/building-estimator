export default function AddCategories({
    selectedCategories,
    setSelectedCategories,
    selectedCategory,
    setSelectedCategory,
    allCategories,
    t,
    estimateLanguage
}) {
  const addCategory = () => {
    if (!selectedCategory) return;

    if (selectedCategories.some((cat) => cat.category === selectedCategory))
      return;

    const maxId =
      selectedCategories.length > 0
        ? Math.max(...selectedCategories.map((cat) => cat.id))
        : 0;

    const newCategory = {
      id: maxId + 1,
      category: selectedCategory,
    };

    setSelectedCategories((prev) => [...prev, newCategory]);
    setSelectedCategory("");
  };

  return (
    <div className="flex flex-wrap gap-4 items-center my-4 lg:text-lg md:text-md sm:text-sm text-xs">
      <select
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 rounded cursor-pointer outline-none"
      >
        <option className="bg-gray-200" value="">
          {t("selectCategory")}
        </option>
        {allCategories.map((cat) => (
          <option key={cat.category} value={cat.category}>
            {cat.translations[estimateLanguage] || cat.category}
          </option>
        ))}
      </select>
      <button
        onClick={addCategory}
        className="bg-cyan-800 hover:bg-cyan-600 text-white py-2 px-4 rounded cursor-pointer"
      >
        + {t("addCategory")}
      </button>
    </div>
  );
}
