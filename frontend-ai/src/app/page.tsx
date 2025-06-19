'use client'
import { useRouter } from "next/navigation"
import { useAuth } from "@/authentication/hook";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app";
import { useChatStream } from "@/api/services/useChat";
export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  if (!isAuthenticated) {
    router.push("/login")
  }
  const { mutate } = useChatStream()
  const {
    chatMessage,
    setChatMessage,
    setAiAnswering,
    aiAnswering,
  } = useAppStore()
    console.log("🚀 ~ Home ~ aiAnswering:", aiAnswering)

  return (
    <Button onClick={() => {
      setChatMessage("hi")
      mutate()

    }}>xxxxxxx</Button>
  );
}
