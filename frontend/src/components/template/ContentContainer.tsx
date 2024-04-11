import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";

export function ContentContainer(props: any) {
    return (
        <div className={"flex flex-col flex-auto relative w-full bg-white dark:bg-gray-800 overflow-y-auto side-nav-hide-scrollbar max-h-[100dvh]"}>
            <Header />

            <div className="flex flex-auto flex-col justify-between">
                <main className={"h-full bg-[#f8f8f8] dark:bg-gray-900"}>
                    <div className="page-container relative h-full flex flex-auto flex-col px-4 sm:px-6 py-4 sm:py-6 md:px-8">{props.children}</div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
