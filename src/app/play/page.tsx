import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PlayNow() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6">Welcome to Marketing Master Mind</h1>
            <p className="text-lg text-center mb-4">
                Fancy your marketing knowledge? Then why not test yourself and challenge your friends and peers to beat you?
            </p>
            <p className="text-md text-center mb-6">
                It only takes 1 minute. You have 10 multiple choice questions to complete. The questions are drawn randomly from
                an ever-growing pool, so nobody gets the same questions each time they take the test.
            </p>
            <p className="text-md text-center mb-8">
                The person with the highest score in the shortest time goes to the top of the Leader Board. At the end of each
                week the leader will receive a prize and will be announced on our LinkedIn page. A new competition starts each
                week.
            </p>
            <div className="flex justify-center">
                <Link href="/auth/register">
                    <Button size="lg">Register and Start Quiz</Button>
                </Link>
            </div>
        </div>
    )
}

