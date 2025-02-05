"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        country: "",
        password: "",
    })
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const result = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                })

                if (result?.error) {
                    console.error(result.error)
                } else {
                    router.push("/quiz/start")
                }
            } else {
                const data = await response.json()
                console.error("Registration failed:", data.error)
            }
        } catch (error) {
            console.error("Registration error:", error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6">Register for the Quiz</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" required onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" required onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" name="company" required onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" required onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required onChange={handleChange} />
                    </div>
                </div>
                <Button type="submit" className="w-full mt-6">
                    Register and Start Quiz
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

