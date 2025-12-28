export const getErrorMessage = (response: any): string => {
    if (response.message) {
        if(Array.isArray(response.message)) {
            return formatErrorMessage(response.message[0])
        }
        return formatErrorMessage(response.message);
    }
    return "Unknown error occurred.";
};

const formatErrorMessage = (msg: string): string => {
    // Customize this function based on how you want to format error messages
    return msg.charAt(0).toUpperCase() + msg.slice(1);
}