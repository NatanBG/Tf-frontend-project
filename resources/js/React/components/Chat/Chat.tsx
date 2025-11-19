import { FormEvent, useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/useWebsocket/useWebsocket";
import { ChatMessage, ReactionType } from "./Chat.types";

function statusLabel(status: string) {
    if (status === "open") return "Conectado";
    if (status === "connecting") return "Conectando...";
    if (status === "closed") return "Desconectado";
    return "Indisponível";
}

export default function Chat() {
    const { status, lastMessage, sendMessage } = useWebSocket();

    const [name, setName] = useState("");
    const [joined, setJoined] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const addMessage = (msg: Omit<ChatMessage, "id">) => {
        setMessages((prev) => [...prev, { id: Date.now(), ...msg }]);
    };

    useEffect(() => {
        if (!lastMessage) return;

        try {
            const data = JSON.parse(lastMessage);

            if (data.type === "system") {
                addMessage({
                    text: data.text,
                    self: false,
                    from: null,
                    type: "system",
                });
                return;
            }

            if (data.type === "message") {
                addMessage({
                    text: data.text,
                    self: data.name === name,
                    from: data.name,
                    type: "message",
                });
                return;
            }

            if (data.type === "reaction") {
                const reactionEmoji = data.reaction === "approved" ? "✅" : "❌";
                const reactionText = data.reaction === "approved" ? "aprovou" : "reprovou";
                
                addMessage({
                    text: `${reactionEmoji} ${reactionText}`,
                    self: data.name === name,
                    from: data.name,
                    type: "reaction",
                    reaction: data.reaction,
                });
                return;
            }

            // caso venha algo inesperado
            addMessage({
                text: String(lastMessage),
                self: false,
                from: null,
                type: "system",
            });
        } catch {
            // caso o servidor mande algo que não seja JSON
            addMessage({
                text: lastMessage,
                self: false,
                from: null,
                type: "system",
            });
        }
    }, [lastMessage, name]);

    const handleJoin = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;

        setJoined(true);

        sendMessage?.(
            JSON.stringify({
                type: "join",
                name: trimmed,
            }),
        );
    };

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || !joined) return;

        sendMessage?.(
            JSON.stringify({
                type: "message",
                name,
                text,
            }),
        );

        setInput("");
    };

    const handleReaction = (reaction: ReactionType) => {
        if (!joined || status !== "open") return;

        sendMessage?.(
            JSON.stringify({
                type: "reaction",
                name,
                reaction,
            }),
        );
    };

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
                <p className="mb-2">
                    <strong>Status WebSocket:</strong> {statusLabel(status)} (
                    <code>ws://localhost:8081</code>)
                </p>

                {!joined ? (
                    <form onSubmit={handleJoin} className="mb-3">
                        <div className="mb-3">
                            <label className="form-label">Seu nome</label>
                            <input
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Digite seu nome"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!name.trim() || status !== "open"}
                        >
                            Entrar no chat
                        </button>
                    </form>
                ) : (
                    <>
                        <div
                            className="mb-3 border rounded p-2"
                            style={{ maxHeight: 320, overflowY: "auto" }}
                        >
                            {messages.length === 0 && (
                                <p className="text-muted text-center my-2">
                                    Nenhuma mensagem ainda.
                                </p>
                            )}

                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={
                                        "d-flex mb-2 " +
                                        (m.type === "reaction"
                                            ? "justify-content-center"
                                            : m.self
                                                ? "justify-content-end"
                                                : "justify-content-start")
                                    }
                                >
                                    <div
                                        className={
                                            "px-3 py-2 rounded-3 " +
                                            (m.type === "system"
                                                ? "bg-light text-muted"
                                                : m.type === "reaction"
                                                    ? m.reaction === "approved"
                                                        ? "bg-success bg-opacity-10 text-success border border-success"
                                                        : "bg-danger bg-opacity-10 text-danger border border-danger"
                                                    : m.self
                                                        ? "bg-primary text-white"
                                                        : "bg-white border")
                                        }
                                    >
                                        <div className="small fw-semibold mb-1">
                                            {m.type === "system"
                                                ? "Sistema"
                                                : m.self
                                                    ? "Você"
                                                    : m.from ?? "Usuário"}
                                        </div>
                                        <div className={m.type === "reaction" ? "fw-bold" : "small"}>
                                            {m.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mb-2 d-flex gap-2 justify-content-center">
                            <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={() => handleReaction("approved")}
                                disabled={status !== "open"}
                                title="Reação rápida: Aprovado"
                            >
                                ✅ Aprovado
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => handleReaction("rejected")}
                                disabled={status !== "open"}
                                title="Reação rápida: Reprovado"
                            >
                                ❌ Reprovado
                            </button>
                        </div>

                        <form onSubmit={handleSend} className="d-flex gap-2">
                            <input
                                className="form-control"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Digite uma mensagem..."
                            />
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={!input.trim() || status !== "open"}
                            >
                                Enviar
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
