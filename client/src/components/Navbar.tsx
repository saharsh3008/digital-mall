import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                            Mall OS
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/directory" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Directory
                        </Link>
                        <Link href="/map" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Map
                        </Link>
                        <Link href="/events" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Events
                        </Link>
                        <Link href="/login" className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-transform hover:scale-105">
                            Tenant Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
