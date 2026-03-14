import {
  findUserById,
  sanitizeUser,
  updateUser
} from "../models/User.model.js";

export async function getOrganiser(req, res) {
  try {
    const organiser = await findUserById(req.params.id);

    if (!organiser || organiser.role !== "organiser") {
      return res.status(404).json({ message: "Organizer not found" });
    }

    return res.json(sanitizeUser(organiser));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateOrganiser(req, res) {
  try {
    const organiser = await findUserById(req.user._id);

    if (!organiser || organiser.role !== "organiser") {
      return res.status(404).json({ message: "Organizer not found" });
    }

    const updatedOrganiser = await updateUser(req.user._id, {
      name: req.body.name || organiser.name,
      organisationName:
        req.body.organisationName || organiser.organisationName,
      phone: req.body.phone || organiser.phone,
      sponsorModeEnabled:
        req.body.sponsorModeEnabled ?? organiser.sponsorModeEnabled,
      profile: req.body.profile || {},
      sponsorshipTiers:
        req.body.sponsorshipTiers ?? organiser.sponsorshipTiers
    });

    return res.json(sanitizeUser(updatedOrganiser));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
