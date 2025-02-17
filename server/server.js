const mongoose = require("mongoose");
const Document = require("./Document");
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json()); // ✅ Middleware to parse JSON body

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/TE1", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

const defaultValue = "";

io.on("connection", (socket) => {
    console.log("📡 New client connected:", socket.id);

    socket.on("get-document", async (documentId) => {
        if (!documentId) {
            console.error("❌ Invalid document ID received.");
            return;
        }

        try {
            const document = await findOrCreateDocument(documentId);
            if (!document) {
                socket.emit("error", "Document not found");
                return;
            }

            socket.join(documentId);
            socket.emit("load-document", { title: document.title, data: document.data });

            socket.on("send-changes", (delta) => {
                socket.broadcast.to(documentId).emit("receive-changes", delta);
            });

            socket.on("save-document", async (data) => {
                try {
                    await Document.findByIdAndUpdate(documentId, { data });
                    console.log(`💾 Document ${documentId} saved successfully`);
                } catch (err) {
                    console.error("❌ Error saving document:", err);
                }
            });

            socket.on("disconnect", () => {
                console.log("❌ Client disconnected:", socket.id);
            });
        } catch (err) {
            console.error("❌ Error handling document:", err);
        }
    });

    socket.on("update-title", async ({ documentId, title }) => {
        try {
            await Document.findByIdAndUpdate(documentId, { title });
            socket.broadcast.to(documentId).emit("receive-title", title);
            console.log(`📝 Document ${documentId} title updated`);
        } catch (err) {
            console.error("❌ Error updating title:", err);
        }
    });    
});

// Helper function to find or create a document
async function findOrCreateDocument(id) {
    try {
        let document = await Document.findById(id);
        if (!document) {
            document = await Document.create({ _id: id, title: "Untitled", data: defaultValue });
            console.log(`📄 New document created: ${id}`);
        }
        return document;
    } catch (err) {
        console.error("❌ Error finding or creating document:", err);
        return null;
    }
}

// Endpoint to save document data
app.post("/documents/:id", async (req, res) => {
    try {
        const { title, data } = req.body;
        if (!title || !data) return res.status(400).json({ error: "Title and data are required" });

        await Document.findByIdAndUpdate(req.params.id, { title, data });
        res.status(200).json({ message: "Document saved successfully" });
    } catch (err) {
        console.error("❌ Failed to save document:", err);
        res.status(500).json({ error: "Failed to save document" });
    }
});

// Start the server
server.listen(3001, () => {
    console.log("🚀 Server running at http://localhost:3001");
});