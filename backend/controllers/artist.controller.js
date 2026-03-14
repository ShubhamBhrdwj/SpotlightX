import {
  findUserById,
  listUsers,
  sanitizeUser,
  updateUser
} from "../models/User.model.js";

export async function listArtists(req, res) {
  try {
    const artists = await listUsers({
      role: "artist",
      genre: req.query.genre,
      city: req.query.city,
      openForWork:
        req.query.openForWork !== undefined
          ? req.query.openForWork === "true"
          : undefined
    });

    return res.json(artists.map((artist) => sanitizeUser(artist)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getArtist(req, res) {
  try {
    const artist = await findUserById(req.params.id);

    if (!artist || artist.role !== "artist") {
      return res.status(404).json({ message: "Artist not found" });
    }

    return res.json(sanitizeUser(artist));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateArtist(req, res) {
  try {
    const artist = await findUserById(req.user._id);

    if (!artist || artist.role !== "artist") {
      return res.status(404).json({ message: "Artist not found" });
    }

    const updatedArtist = await updateUser(req.user._id, {
      name: req.body.name || artist.name,
      phone: req.body.phone || artist.phone,
      profile: req.body.profile || {}
    });

    return res.json(sanitizeUser(updatedArtist));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
