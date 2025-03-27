export default function EstimateTotal({
    total,
    taxRate,
    setTaxRate,
    taxAmount,
    t
}) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3>Total:</h3>
        <h3>{total.toFixed(2)} €</h3>
      </div>
      <div className="flex justify-between items-center">
        <label>{t("tax")} (%):</label>
        <input
          type="number"
          className="border p-2 w-16 outline-none"
          value={taxRate === null ? "" : taxRate}
          onChange={(e) =>
            setTaxRate(e.target.value === "" ? null : Number(e.target.value))
          }
        />
      </div>
      <div className="flex justify-between items-center">
        <h3>{t("taxAmount")}:</h3>
        <h3>{taxAmount.toFixed(2)} €</h3>
      </div>
      <div className="flex justify-between items-center mt-4 p-2 bg-gray-100 rounded-lg">
        <h3 className="lg:text-xl md:text-lg sm:text-md text-sm font-bold">
          {t("totalWithTax")}:
        </h3>
        <span className="text-green-600 font-bold">
          {(total + taxAmount).toFixed(2)} €
        </span>
      </div>
    </>
  );
}
