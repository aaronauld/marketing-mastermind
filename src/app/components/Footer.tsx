import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#8B9B3C] py-4 px-6">
      <div className="container mx-auto flex justify-center items-center space-x-2 text-sm text-white">
        <Link href="/privacy-policy" className="hover:text-gray-200">
          <u>Privacy Policy</u>
        </Link>
        <span>Copyright Marketing Mastermind</span>
      </div>
    </footer>
  )
}

