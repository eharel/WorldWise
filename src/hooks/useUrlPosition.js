import { useSearchParams } from "react-router-dom";

/**
 *
 * @returns [lat, lng]
 */
export function useUrlPosition() {
  /// Our custom hook is built upon another custom hook -- that of react router, useSearchParams.
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return [lat, lng];
}
