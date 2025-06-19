'use client'
import { useRouter } from "next/navigation"
import { useAuth } from "@/authentication/hook";
export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  if (!isAuthenticated) {
    router.push("/login")
  }
  return (
    <div>"heelo"</div>
  );
}
