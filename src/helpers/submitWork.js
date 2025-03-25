export default async function submitWork(
  {
    editingWork,
    workName,
    category,
    formula,
    unit,
    priceForUnit,
    updatedTranslations,
    variables,
    categories,
  },
  db
) {
  if (editingWork) {
    await db.works.update(editingWork.id, {
      name: workName,
      category,
      formula,
      unit,
      priceForUnit: Number(priceForUnit) || 0,
      translations: updatedTranslations,
      variables,
    });
  } else {
    const newWork = {
      id: Date.now().toString(),
      workName: workName,
      formula,
      unit,
      priceForUnit: Number(priceForUnit) || 0,
      translations: updatedTranslations,
      variables,
    };

    const existingCategoryRecord = await db.works
      .where("category")
      .equals(category)
      .first();

    if (existingCategoryRecord) {
      const updatedWorksArray = [...existingCategoryRecord.works, newWork];
      await db.works.update(existingCategoryRecord.id, {
        works: updatedWorksArray,
      });
    } else {
      const categoryDetails = categories.find(
        (cat) => cat.category === category
      );
      const newCategoryRecord = {
        category,
        translations: categoryDetails
          ? categoryDetails.translations
          : { en: category },
        works: [newWork],
      };
      await db.works.add(newCategoryRecord);
    }
  }
}
