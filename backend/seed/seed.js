import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import {
  createApplication,
  deleteAllApplications,
  updateApplication
} from "../models/Application.model.js";
import { createEvent, deleteAllEvents } from "../models/Event.model.js";
import { createMessage, deleteAllMessages } from "../models/Message.model.js";
import {
  createNotification,
  deleteAllNotifications
} from "../models/Notification.model.js";
import {
  createSponsorship,
  deleteAllSponsorships
} from "../models/Sponsorship.model.js";
import {
  createManySponsorshipTiers,
  deleteAllSponsorshipTiers
} from "../models/SponsorshipTier.model.js";
import { createUser, deleteAllUsers } from "../models/User.model.js";

dotenv.config();

function pexelsPhoto(id, width = 1400) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

const artistSeeds = [
  {
    key: "mira",
    name: "Mira Vox",
    email: "mira@spotlightx.demo",
    city: "Bengaluru",
    genres: ["Indie", "Soul", "Acoustic"],
    priceRange: "Rs.18k - Rs.32k",
    rating: 4.9,
    headline: "Indie-soul vocalist for college nights and intimate ticketed shows.",
    bio: "Mira blends acoustic storytelling with polished live vocals for campus festivals, lounges, and wedding sangeet evenings.",
    coverImage: pexelsPhoto("30489705"),
    gallery: [
      pexelsPhoto("30489705"),
      pexelsPhoto("17570361")
    ],
    pastEvents: [
      "Monsoon Unplugged at The Courtyard, Bengaluru",
      "Southline College Fest, Mysuru",
      "Private wedding afterparty, Coorg"
    ],
    certifications: ["Live performance certificate", "Music school reference"],
    sponsorModeEnabled: true,
    verificationDocs: ["aadhaar", "past-event-poster", "music-school-letter"],
    sponsorshipTiers: [
      {
        name: "Silver",
        amount: 80000,
        benefits: ["Story mentions", "Stage logo panel"]
      }
    ]
  },
  {
    key: "ledger",
    name: "Laugh Ledger",
    email: "laughledger.mumbai@spotlightx.demo",
    city: "Mumbai",
    genres: ["Stand-up", "Improv", "Crowd Work"],
    priceRange: "Rs.25k - Rs.40k",
    rating: 4.8,
    headline: "Observational stand-up comic with strong crowd work for clubs and college fests.",
    bio: "Laugh Ledger performs fast-paced English and Hindi stand-up sets designed for clubs, open-air festivals, and campus lineups.",
    coverImage: pexelsPhoto("35481826"),
    gallery: [
      pexelsPhoto("35481826"),
      pexelsPhoto("10078868")
    ],
    pastEvents: [
      "Late Laughs at SeaSalt Club, Mumbai",
      "Youth Pulse Fest, Navi Mumbai",
      "Corporate comedy night, Powai"
    ],
    certifications: ["Event reel", "PAN", "Comedy workshop mentor note"],
    sponsorModeEnabled: true,
    verificationDocs: ["pan", "event-reel"]
  },
  {
    key: "prism",
    name: "Prism Motion",
    email: "prism.motion@spotlightx.demo",
    city: "Delhi",
    genres: ["Contemporary", "Dance", "Stage Visuals"],
    priceRange: "Rs.30k - Rs.60k",
    rating: 4.9,
    headline: "Contemporary dance crew for festival openings, launches, and cultural productions.",
    bio: "Prism Motion stages large-format choreography with LED-friendly movement design and quick venue adaptation.",
    coverImage: pexelsPhoto("27378961"),
    gallery: [
      pexelsPhoto("27378961"),
      pexelsPhoto("23964425")
    ],
    pastEvents: [
      "Capital Arts Festival, Delhi",
      "Pulse Product Launch, Gurugram",
      "Winter Wedding Showcase, Noida"
    ],
    certifications: ["Dance academy reference", "Tour poster archive"],
    verificationDocs: ["government-id", "festival-poster"]
  },
  {
    key: "canvas",
    name: "Canvas Ritual",
    email: "canvas.ritual@spotlightx.demo",
    city: "Ahmedabad",
    genres: ["Live Painting", "Installation", "Brand Art"],
    priceRange: "Rs.15k - Rs.35k",
    rating: 4.7,
    headline: "Live painter creating branded and experiential canvases during events.",
    bio: "Canvas Ritual combines live art with sponsor-friendly installations for expos, fashion showcases, and wedding lounges.",
    coverImage: pexelsPhoto("33952938"),
    gallery: [
      pexelsPhoto("33952938"),
      pexelsPhoto("9032145")
    ],
    pastEvents: [
      "Palette Weekender, Ahmedabad",
      "Craft and Culture Expo, Surat",
      "Luxury wedding foyer art wall, Udaipur"
    ],
    certifications: ["Fine arts institute reference"],
    verificationDocs: ["institute-letter", "portfolio-doc"]
  },
  {
    key: "velvet",
    name: "Velvet Pulse",
    email: "velvet.pulse@spotlightx.demo",
    city: "Goa",
    genres: ["DJ", "House", "Open Format"],
    priceRange: "Rs.28k - Rs.55k",
    rating: 4.6,
    headline: "Open-format DJ for club nights, afterparties, and destination celebrations.",
    bio: "Velvet Pulse delivers high-energy sets with flexible branding moments for nightlife venues and wedding afterparties.",
    coverImage: pexelsPhoto("15016142"),
    gallery: [
      pexelsPhoto("15016142"),
      pexelsPhoto("5958251")
    ],
    pastEvents: [
      "Harbor Lights Club Night, Goa",
      "Beachside private afterparty, North Goa",
      "Sunset Deck Series, Panjim"
    ],
    certifications: ["Residency contract archive"],
    verificationDocs: ["government-id", "club-lineup-poster"]
  },
  {
    key: "mirage",
    name: "Mirage Mystic",
    email: "mirage.mystic@spotlightx.demo",
    city: "Kolkata",
    genres: ["Magic", "Illusion", "Host Interaction"],
    priceRange: "Rs.20k - Rs.38k",
    rating: 4.8,
    headline: "Interactive illusion set for weddings, expos, and stage-hosted variety nights.",
    bio: "Mirage Mystic mixes stage illusion with light audience participation for family events, receptions, and expo engagement zones.",
    coverImage: pexelsPhoto("29708268"),
    gallery: [
      pexelsPhoto("29708268"),
      pexelsPhoto("29708246")
    ],
    pastEvents: [
      "City Showcase Expo, Kolkata",
      "Grand reception illusion slot, Howrah",
      "Holiday variety night, Salt Lake"
    ],
    certifications: ["Performance guild recommendation"],
    verificationDocs: ["id-proof", "show-recommendation"]
  }
];

const organiserSeeds = [
  {
    key: "aarambh",
    name: "Aarambh Events",
    organisationName: "Aarambh Events LLP",
    email: "organiser@spotlightx.demo",
    city: "Jaipur",
    venueTypes: ["College Fest", "Expo", "Wedding"],
    rating: 4.7,
    verificationDocs: ["gst-proof", "trade-license", "venue-photos"]
  },
  {
    key: "bluehour",
    name: "Blue Hour Venues",
    organisationName: "Blue Hour Venues",
    email: "bluehour@spotlightx.demo",
    city: "Pune",
    venueTypes: ["Bar", "Rooftop", "Club"],
    rating: 4.8,
    verificationDocs: ["gst-proof", "bar-license", "geo-tagged-photos"]
  },
  {
    key: "mosaic",
    name: "Mosaic Live",
    organisationName: "Mosaic Live Experiences",
    email: "mosaic@spotlightx.demo",
    city: "Hyderabad",
    venueTypes: ["Expo", "Corporate", "Wedding"],
    rating: 4.6,
    verificationDocs: ["gst-proof", "trade-license", "business-id"]
  }
];

const eventSeeds = [
  {
    organiserKey: "aarambh",
    title: "Aarambh College Fest",
    description:
      "Two-day annual culture fest seeking singers, comedians, dance crews, and visual acts for the main arena lineup.",
    city: "Jaipur",
    venueName: "Aarambh Campus Arena",
    venueType: "College",
    eventType: "Fest",
    genreTags: ["Pop", "Stand-up", "Dance"],
    audienceSize: 4500,
    footfallFrequency: "Annual flagship festival",
    paymentOffer: 55000,
    eventDate: "2026-08-21T00:00:00.000Z",
    sponsorOpen: true,
    verificationStatus: "verified",
    coverImage: pexelsPhoto("23964425"),
    gallery: [
      pexelsPhoto("23964425"),
      pexelsPhoto("26368149")
    ],
    proofDocuments: ["gst-receipt", "organiser-id", "director-license"],
    geoTaggedImages: [pexelsPhoto("23964425")]
  },
  {
    organiserKey: "bluehour",
    title: "Rooftop Rhythm Night",
    description:
      "Weekly rooftop showcase for acoustic, soul, and mellow electronic sets with a sunset dining audience.",
    city: "Pune",
    venueName: "Blue Hour Terrace",
    venueType: "Rooftop",
    eventType: "Showcase",
    genreTags: ["Acoustic", "Soul", "House"],
    audienceSize: 180,
    footfallFrequency: "Weekly Friday format",
    paymentOffer: 22000,
    eventDate: "2026-04-17T00:00:00.000Z",
    sponsorOpen: false,
    verificationStatus: "verified",
    coverImage: pexelsPhoto("2747450"),
    gallery: [
      pexelsPhoto("2747450"),
      pexelsPhoto("13230484")
    ],
    proofDocuments: ["venue-license", "gst-receipt"],
    geoTaggedImages: [pexelsPhoto("2747450")]
  },
  {
    organiserKey: "mosaic",
    title: "Palette x Pulse Expo",
    description:
      "Lifestyle expo looking for live painters, magicians, and interactive performers for brand activation zones.",
    city: "Hyderabad",
    venueName: "Mosaic Convention Hall",
    venueType: "Expo",
    eventType: "Expo",
    genreTags: ["Live Painting", "Magic", "Interactive"],
    audienceSize: 2600,
    footfallFrequency: "Seasonal exhibition weekend",
    paymentOffer: 38000,
    eventDate: "2026-06-12T00:00:00.000Z",
    sponsorOpen: true,
    verificationStatus: "verified",
    coverImage: pexelsPhoto("12657546"),
    gallery: [
      pexelsPhoto("12657546"),
      pexelsPhoto("23964430")
    ],
    proofDocuments: ["expo-license", "venue-contract"],
    geoTaggedImages: [pexelsPhoto("12657546")]
  },
  {
    organiserKey: "aarambh",
    title: "Royal Courtyard Sangeet",
    description:
      "Wedding venue booking live singers, DJs, and illusion performers for a premium multi-family sangeet evening.",
    city: "Udaipur",
    venueName: "Royal Courtyard",
    venueType: "Wedding Venue",
    eventType: "Wedding",
    genreTags: ["Singer", "DJ", "Magic"],
    audienceSize: 600,
    footfallFrequency: "Destination wedding booking",
    paymentOffer: 47000,
    eventDate: "2026-10-04T00:00:00.000Z",
    sponsorOpen: false,
    verificationStatus: "verified",
    coverImage: pexelsPhoto("13326534"),
    gallery: [
      pexelsPhoto("13326534"),
      pexelsPhoto("13326534")
    ],
    proofDocuments: ["venue-proof", "contract"],
    geoTaggedImages: [pexelsPhoto("13326534")]
  },
  {
    organiserKey: "bluehour",
    title: "Late Laughs Club Night",
    description:
      "Club-format comedy showcase with two host slots and one headline stand-up act for a Saturday crowd.",
    city: "Mumbai",
    venueName: "Blue Hour Comedy Cellar",
    venueType: "Club",
    eventType: "Comedy Night",
    genreTags: ["Stand-up", "Improv"],
    audienceSize: 240,
    footfallFrequency: "Monthly recurring night",
    paymentOffer: 30000,
    eventDate: "2026-05-09T00:00:00.000Z",
    sponsorOpen: true,
    verificationStatus: "pending",
    coverImage: pexelsPhoto("28288053"),
    gallery: [pexelsPhoto("28288053")],
    proofDocuments: ["venue-license"],
    geoTaggedImages: [pexelsPhoto("28288053")]
  },
  {
    organiserKey: "mosaic",
    title: "Innovation After Hours",
    description:
      "Corporate expo after-hours set requiring DJs, dancers, and ambient performers for networking energy.",
    city: "Hyderabad",
    venueName: "Mosaic Tech Dome",
    venueType: "Expo",
    eventType: "Corporate Night",
    genreTags: ["DJ", "Dance", "Ambient"],
    audienceSize: 900,
    footfallFrequency: "Quarterly industry mixer",
    paymentOffer: 52000,
    eventDate: "2026-07-18T00:00:00.000Z",
    sponsorOpen: true,
    verificationStatus: "verified",
    coverImage: pexelsPhoto("35593189"),
    gallery: [pexelsPhoto("35593189"), pexelsPhoto("13230484")],
    proofDocuments: ["expo-approval", "business-contract"],
    geoTaggedImages: [pexelsPhoto("35593189")]
  },
  {
    organiserKey: "bluehour",
    title: "Harbor Lights Music Weekender",
    description:
      "A sea-facing weekender looking for indie singers and open-format DJs across two sunset slots.",
    city: "Goa",
    venueName: "Harbor Lights Deck",
    venueType: "Beach Club",
    eventType: "Weekender",
    genreTags: ["Indie", "DJ", "Soul"],
    audienceSize: 700,
    footfallFrequency: "Seasonal weekender",
    paymentOffer: 48000,
    eventDate: "2026-11-13T00:00:00.000Z",
    sponsorOpen: true,
    verificationStatus: "verified",
    coverImage: pexelsPhoto("1190295"),
    gallery: [pexelsPhoto("1190295"), pexelsPhoto("17570361")],
    proofDocuments: ["venue-license", "event-permit"],
    geoTaggedImages: [pexelsPhoto("1190295")]
  }
];

async function seed() {
  await connectDB();

  await Promise.all([
    deleteAllApplications(),
    deleteAllMessages(),
    deleteAllNotifications(),
    deleteAllSponsorships(),
    deleteAllSponsorshipTiers(),
    deleteAllEvents(),
    deleteAllUsers()
  ]);

  const password = await bcrypt.hash("password123", 10);

  const artists = {};
  for (const artist of artistSeeds) {
    artists[artist.key] = await createUser({
      name: artist.name,
      email: artist.email,
      password,
      role: "artist",
      sponsorModeEnabled: artist.sponsorModeEnabled || false,
      profile: {
        city: artist.city,
        genres: artist.genres,
        priceRange: artist.priceRange,
        rating: artist.rating,
        bio: artist.bio,
        headline: artist.headline,
        openForWork: true,
        portfolio: artist.gallery,
        coverImage: artist.coverImage,
        gallery: artist.gallery,
        pastEvents: artist.pastEvents,
        certifications: artist.certifications
      },
      verification: {
        status: "verified",
        documents: artist.verificationDocs
      },
      sponsorshipTiers: artist.sponsorshipTiers || []
    });
  }

  const organisers = {};
  for (const organiser of organiserSeeds) {
    organisers[organiser.key] = await createUser({
      name: organiser.name,
      organisationName: organiser.organisationName,
      email: organiser.email,
      password,
      role: "organiser",
      sponsorModeEnabled: true,
      profile: {
        city: organiser.city,
        venueTypes: organiser.venueTypes,
        rating: organiser.rating,
        bio: `${organiser.organisationName} curates verified venues and event listings across ${organiser.city}.`
      },
      verification: {
        status: "verified",
        documents: organiser.verificationDocs
      }
    });
  }

  const events = {};
  for (const event of eventSeeds) {
    const createdEvent = await createEvent({
      organiser: organisers[event.organiserKey]._id,
      ...event
    });
    events[event.title] = createdEvent;
  }

  await createManySponsorshipTiers([
    {
      ownerType: "event",
      event: events["Aarambh College Fest"]._id,
      name: "Gold",
      amount: 150000,
      benefits: ["Main stage branding", "Host mentions", "Social campaign"]
    },
    {
      ownerType: "event",
      event: events["Palette x Pulse Expo"]._id,
      name: "Silver",
      amount: 90000,
      benefits: ["Activation booth branding", "Stage shoutout"]
    },
    {
      ownerType: "artist",
      artist: artists.mira._id,
      name: "Silver",
      amount: 80000,
      benefits: ["On-stage product placement", "Instagram story mentions"]
    }
  ]);

  const sampleApplication = await createApplication({
    event: events["Aarambh College Fest"]._id,
    artist: artists.mira._id,
    message: "I would love to perform an indie-soul sunset set for the opening night."
  });

  await updateApplication(sampleApplication._id, {
    status: "shortlisted"
  });

  await createMessage({
    application: sampleApplication._id,
    sender: artists.mira._id,
    recipient: organisers.aarambh._id,
    body: "I would love to perform an indie-soul sunset set for the opening night."
  });

  await createMessage({
    application: sampleApplication._id,
    sender: organisers.aarambh._id,
    recipient: artists.mira._id,
    body: "Your profile looks like a strong fit. Can you confirm your travel availability for Jaipur on August 20?"
  });

  await createNotification({
    user: organisers.aarambh._id,
    type: "application",
    title: `New application for ${events["Aarambh College Fest"].title}`,
    body: `${artists.mira.name} applied to your event.`,
    link: "/organiser/inbox",
    meta: {
      applicationId: sampleApplication._id,
      eventId: events["Aarambh College Fest"]._id
    }
  });

  await createNotification({
    user: artists.mira._id,
    type: "application-status",
    title: `${events["Aarambh College Fest"].title} updated your application`,
    body: "Status changed to shortlisted.",
    link: "/artist/inbox",
    meta: {
      applicationId: sampleApplication._id,
      status: "shortlisted"
    }
  });

  await createNotification({
    user: artists.mira._id,
    type: "message",
    title: `New message for ${events["Aarambh College Fest"].title}`,
    body: "Your profile looks like a strong fit. Can you confirm your travel availability for Jaipur on August 20?",
    link: "/artist/inbox",
    meta: {
      applicationId: sampleApplication._id,
      eventId: events["Aarambh College Fest"]._id
    }
  });

  const sponsorOpportunity = await createSponsorship({
    sponsor: organisers.aarambh._id,
    targetType: "artist",
    targetArtist: artists.mira._id,
    tier: "Silver",
    amount: 80000,
    sponsorAsset: "Stage logo panel",
    notes: "We would like brand placement during your sunset set.",
    status: "proposed"
  });

  await createNotification({
    user: artists.mira._id,
    type: "sponsorship-opportunity",
    title: `${organisers.aarambh.organisationName} sent you a sponsorship opportunity`,
    body: `Silver tier for Rs.${sponsorOpportunity.amount} with ${sponsorOpportunity.sponsorAsset}.`,
    link: "/artist/inbox",
    meta: {
      sponsorshipId: sponsorOpportunity._id,
      sponsorId: organisers.aarambh._id,
      tier: sponsorOpportunity.tier,
      amount: sponsorOpportunity.amount
    }
  });

  console.log("Seed complete");
  console.log({
    artistLogin: "mira@spotlightx.demo / password123",
    comedianAccount: "laughledger.mumbai@spotlightx.demo / password123",
    organiserLogin: "organiser@spotlightx.demo / password123",
    artistsSeeded: Object.keys(artists).length,
    eventsSeeded: Object.keys(events).length
  });
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
