"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/Login");
  }, []);

  return (
    <body>
      <div></div>
    </body>
  );
}
