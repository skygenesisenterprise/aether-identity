import { Suspense } from "react";
import AuthorizeClient from "./AuthorizeClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthorizeClient />
    </Suspense>
  );
}
