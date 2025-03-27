import { evaluate } from "mathjs";

export const normalizedRowsHelper = (tableRows) => {
  return tableRows.reduce((acc, row) => {
    if (row.works && Array.isArray(row.works)) {
      row.works.forEach((work) => {
        acc.push({
          ...work,
          categoryId: row.id,
        });
      });
    } else {
      acc.push(row);
    }
    return acc;
  }, []);
};

export const calculateFormula = (formula, variables) => {
  if (!formula) return 0;
  try {
    return evaluate(formula, variables);
  } catch (error) {
    return "Error";
  }
};
