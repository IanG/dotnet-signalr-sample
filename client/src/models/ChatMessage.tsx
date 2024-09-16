export default interface ChatMessage {
    from: string;
    text: string;
    sentAt: Date; //string;
    isIncoming: boolean;
}