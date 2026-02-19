import { Suspense } from "react";
import ForgotClient from "./ForgotClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ForgotClient />
    </Suspense>
  );
}
