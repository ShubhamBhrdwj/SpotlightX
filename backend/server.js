import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import applicationRoutes from "./routes/application.routes.js";
import artistRoutes from "./routes/artist.routes.js";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import organiserRoutes from "./routes/organiser.routes.js";
import sponsorRoutes from "./routes/sponsor.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "SpotlightX API",
    status: "ok",
    modules: [
      "auth",
      "artists",
      "organisers",
      "events",
      "applications",
      "notifications",
      "sponsors"
    ]
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/organisers", organiserRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sponsors", sponsorRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
