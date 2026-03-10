export const getErrorMessage = (response: unknown): string => {
    if (typeof response === 'object' && response !== null && 'message' in response) {
        const msg = (response as { message: unknown }).message;
        if(Array.isArray(msg)) {
            return formatErrorMessage(String(msg[0]));
        }
        return formatErrorMessage(String(msg));
    }
    return "Unknown error occurred.";
};

const formatErrorMessage = (msg: string): string => {
    // Customize this function based on how you want to format error messages
    return msg.charAt(0).toUpperCase() + msg.slice(1);
}