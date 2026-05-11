export interface ISendEmail {
    recipent: string;
    subject: string;
    html: string;
    text?: string;
}
