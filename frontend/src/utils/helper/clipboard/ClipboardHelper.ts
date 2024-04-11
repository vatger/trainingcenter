export async function copyText(text: string) {
    return navigator.clipboard.writeText(text);
}
