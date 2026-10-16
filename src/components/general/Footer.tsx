import Logo from "../navbar/Logo";


export default function Footer() {
    return (
        <div className="mt-20 border-t border-border">
            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <Logo/>

                <p className="text-xs text-text/60">
                    &copy; {new Date().getFullYear()} SeoulSync. All rights reserved.
                </p>
            </div>
        </div>
    )
}