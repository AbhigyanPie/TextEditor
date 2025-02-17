import React, { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";

const SAVE_INTERVAL_MS = 5000;
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];

export default function TextEditor() {
    const { id: documentId } = useParams();
    const [socket, setSocket] = useState(null);
    const [quill, setQuill] = useState(null);
    const [title, setTitle] = useState("Untitled Document");
    const [lastSaved, setLastSaved] = useState("");

    // Initialize socket connection
    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);
        return () => s.disconnect();
    }, []);

    // Load document
    useEffect(() => {
        if (!socket || !quill) return;

        socket.once("load-document", (document) => {
            if (!document) {
                console.error("❌ Failed to load document");
                return;
            }
            setTitle(document.title || "Untitled Document");
            quill.setContents(document.data);
            quill.enable();
        });

        socket.emit("get-document", documentId);
    }, [socket, quill, documentId]);

    // Auto-save document
    useEffect(() => {
        if (!socket || !quill) return;

        const interval = setInterval(async () => {
            const updatedContent = quill.getContents();
            socket.emit("save-document", updatedContent);

            try {
                await axios.post(`http://localhost:3001/documents/${documentId}`, {
                    title,
                    data: updatedContent,
                });
                setLastSaved(new Date().toLocaleTimeString());
            } catch (err) {
                console.error("❌ Error saving document:", err);
            }
        }, SAVE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [socket, quill, title]);

    // Handle changes from server
    useEffect(() => {
        if (!socket || !quill) return;

        const handler = (delta) => {
            quill.updateContents(delta);
        };

        socket.on("receive-changes", handler);
        return () => socket.off("receive-changes", handler);
    }, [socket, quill]);

    // Send changes
    useEffect(() => {
        if (!socket || !quill) return;

        const handler = (delta, oldDelta, source) => {
            if (source !== "user") return;
            socket.emit("send-changes", delta);
        };

        quill.on("text-change", handler);
        return () => quill.off("text-change", handler);
    }, [socket, quill]);

    // Handle title change
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (socket) {
            socket.emit("update-title", { documentId, title: newTitle });
        }
    };
    
    // Listen for title updates from the server
    useEffect(() => {
        if (!socket) return;
    
        const handleTitleUpdate = (updatedTitle) => {
            setTitle(updatedTitle);
        };
    
        socket.on("receive-title", handleTitleUpdate);
    
        return () => socket.off("receive-title", handleTitleUpdate);
    }, [socket]);

    // Quill Editor Setup
    const wrapperRef = useCallback((wrapper) => {
        if (!wrapper) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
        });
        q.disable();
        q.setText("Loading...");
        setQuill(q);
    }, []);

    return (
        <div className="editor-container">
            <div className="navbar">
                <input type="text" value={title} onChange={handleTitleChange} className="doc-title" />
                <span className="last-saved">{lastSaved ? `Last saved at ${lastSaved}` : "Saving..."}</span>
            </div>
            <div className="container" ref={wrapperRef}></div>
        </div>
    );
}