export function isArtist(req, res, next) {
  if (req.user?.role !== "artist") {
    return res.status(403).json({ message: "Artist access only" });
  }

  next();
}

export function isOrganiser(req, res, next) {
  if (req.user?.role !== "organiser") {
    return res.status(403).json({ message: "Organizer access only" });
  }

  next();
}
