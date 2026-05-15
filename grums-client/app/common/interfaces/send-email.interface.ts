export interface ISendEmail {
    recipient: string;
    subject: string;
    html: string;
    text?: string;
}
