import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-row gap-4 justify-center items-center lg:mx-38 md:mx-24 sm:mx-14 mx-4 md:px-8 sm:px-4 px-2 sm:py-6 py-4 border-x border-gray-700">
      <h1 className="text-center w-full text-slate-400">
        Built and designed by&nbsp;
        <br />
        <Link
          to={"https://ivanbodnarash.vercel.app/"}
          target="_blank"
          title="Head to Ivan's Portfolio"
        >
          Ivan Bodnarash
        </Link>{" "}
        &copy; {currentYear}
      </h1>
    </div>
  );
}
