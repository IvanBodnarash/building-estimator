export default function EstimateHeader({
  estimateLanguage,
  setEstimateLanguage,
  t,
}) {
  return (
    <div className="flex opacity-80 justify-between items-center mb-4">
      <h2 className="lg:text-xl md:text-lg sm:text-base text-sm font-bold">
        {t("estimateCalculator")}
      </h2>

      <div className="">
        <label className="mr-2 lg:text-lg md:text-md sm:text-sm text-xs">
          {t("estimateLanguage")}:
        </label>
        <select
          className="sm:p-2 p-0 outline-none lg:text-lg md:text-md sm:text-sm text-xs cursor-pointer"
          value={estimateLanguage}
          onChange={(e) => setEstimateLanguage(e.target.value)}
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="uk">UK</option>
          <option value="ru">RU</option>
        </select>
      </div>
    </div>
  );
}
