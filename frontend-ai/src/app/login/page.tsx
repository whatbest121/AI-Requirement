import useAuth from "@/api/services/auth"
import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
   
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="space-y-6">
                <LoginForm />
                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
} 