// Chat.types.ts
export type ReactionType = "approved" | "rejected";

export type ChatMessage = {
    id: number;
    text: string;
    self: boolean;
    from: string | null;
    type: "system" | "message" | "reaction";
    reaction?: ReactionType;
};
