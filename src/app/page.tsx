"use client";
import { useRouter } from 'next/navigation'
export default function LoginPage() {
  const router = useRouter()
  router.push('/Login')
  return (
    <div>
    </div>
  );
}
