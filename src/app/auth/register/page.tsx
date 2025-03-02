"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormData {
    firstName: string
    lastName: string
    company: string
    email: string
    country: string
    password: string
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        country: "",
        password: "",
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || `Registration failed with status ${response.status}`)
            }

            // If registration is successful, sign in
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                throw new Error(result.error || "Login failed after registration")
            } else {
                router.push("/quiz/start")
            }
        } catch (error) {
            console.error("Registration error:", error)
            setError(error instanceof Error ? error.message : "An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6">Register for the Quiz</h1>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" required onChange={handleChange} value={formData.firstName} />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" required onChange={handleChange} value={formData.lastName} />
                    </div>
                    <div>
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" name="company" onChange={handleChange} value={formData.company} />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required onChange={handleChange} value={formData.email} />
                    </div>
                    <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" onChange={handleChange} value={formData.country} />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register and Start Quiz"}
                </Button>
            </form>
            <div className="text-center mt-4">
                <Link href="/play" className="text-blue-500 hover:underline">
                    Back to Play Now
                </Link>
            </div>
        </div>
    )
}

