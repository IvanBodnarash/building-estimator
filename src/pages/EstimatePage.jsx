import { useParams } from "react-router-dom";

export default function EstimatePage() {
  const params = useParams();

  return <div>EstimatePage, {params.estimateId}</div>;
}
