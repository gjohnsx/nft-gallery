import { PuzzleIcon, CubeIcon } from "@heroicons/react/solid"

export default function Header() {
    return (
      <header className="bg-blue-600">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="w-full py-6 flex items-center justify-between">
            <div className="flex items-center">
              <a href="#">
                <span className="sr-only">Workflow</span>
                    <PuzzleIcon className="w-8 h-8 text-white"/>
              </a>
            </div>
          </div>
        </nav>
      </header>
    );
};