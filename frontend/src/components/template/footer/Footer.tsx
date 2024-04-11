export function Footer() {
    return (
        <div className={"bg-[#f8f8f8]"}>
            <footer className="footer items-end dark:bg-gray-900 px-4">
                <div className="flex items-center justify-between flex-auto w-full py-4">
                    <p>
                        &copy; {new Date().getFullYear()}{" "}
                        <a className={"hover:underline"} target={"_blank"} href={"https://vatsim-germany.org"}>
                            VATGER
                        </a>
                    </p>
                    <div className="flex">
                        <a className="text-gray hover:underline" target={"_blank"} href={"https://vatsim-germany.org/gdpr"}>
                            Datenschutzerklärung
                        </a>
                        <span className={"mx-1"}>|</span>
                        <a className="text-gray hover:underline" target={"_blank"} href={"https://vatsim-germany.org/imprint"}>
                            Impressum
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
