export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md">
                <img src="/images/icon/favicon-new.svg" alt="ResCat" className="size-8" />
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <span className="mb-0.5 truncate leading-tight font-bold text-2xl text-[#0091F3]">
                    ResCat
                </span>
            </div>
        </>
    );
}
