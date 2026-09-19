import AppLayout from '../Layouts/AppLayout';

export default function NotFound() {
    return (
        <AppLayout title="404 — Level Not Found">
            <div className="min-h-screen flex items-center justify-center bg-sky-texture px-4">
                <div className="text-center max-w-lg">
                    <div className="font-display text-6xl sm:text-8xl text-[#F05A6E] mb-4 drop-shadow-[0_4px_0_#101020]">
                        404
                    </div>
                    <div className="panel-pixel p-6 mb-6">
                        <div className="font-pixel text-sm sm:text-base text-[#101020] uppercase mb-3">
                            ⚠ LEVEL NOT FOUND
                        </div>
                        <p className="font-retro text-lg sm:text-xl text-[#3A4657]">
                            The page you're looking for doesn't exist in this world.
                            <br />
                            Maybe it was moved, or you entered the wrong URL.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a href="/" className="btn-pixel">
                            ◀ BACK TO HOME
                        </a>
                        <a href="/#stage-select" className="btn-pixel btn-pixel-blue">
                            ★ STAGE SELECT
                        </a>
                    </div>
                    <div className="mt-8 font-pixel text-[8px] text-[#3A4657] uppercase">
                        GAME OVER? PRESS START TO CONTINUE.
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
