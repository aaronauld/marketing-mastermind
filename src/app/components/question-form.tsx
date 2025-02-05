"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface QuestionFormProps {
    onClose: () => void
    onSubmit: (formData: QuestionFormData) => void
}

export interface QuestionFormData {
    name: string
    email: string
    question: string
    answers: string[]
}

export function QuestionForm({ onClose, onSubmit }: QuestionFormProps) {
    const [formData, setFormData] = useState<QuestionFormData>({
        name: "",
        email: "",
        question: "",
        answers: ["", "", "", ""],
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleAnswerChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            answers: prev.answers.map((answer, i) => (i === index ? value : answer)),
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
                <h2 className="text-2xl font-bold mb-4">Submit a Question</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="question">Question</Label>
                        <Textarea id="question" name="question" value={formData.question} onChange={handleChange} required />
                    </div>
                    {formData.answers.map((answer, index) => (
                        <div key={index}>
                            <Label htmlFor={`answer-${index}`}>Answer {index + 1}</Label>
                            <Input
                                id={`answer-${index}`}
                                value={answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                required
                            />
                        </div>
                    ))}
                    <Button type="submit" className="w-full">
                        Submit Question
                    </Button>
                </form>
            </div>
        </div>
    )
}

