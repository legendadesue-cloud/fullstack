export interface Event {
  id: number;
  title: string;
  status: "current" | "upcoming" | "finished";
  image: string;
  alt: string;
  category: string;
  organization: string;
  location: string;
  date: string;
  description: string;
  buttonText: string;
  disabled: boolean;
}

export const events: Event[] = [

  {
    "id": 1,
    "title": "Community Health Outreach",
    "status": "current",
    "image": "/images/COMMUNITY EME.jpg",
    "alt": "Community Health Outreach",
    "category": "Healthcare",
    "organization": "Red Cross Nigeria",
    "location": "Abuja",
    "date": "July 28, 2026",
    "description": "Assist medical teams during free community health screenings.",
    "buttonText": "Apply Now",
    "disabled": false
  },
  {
    "id": 2,
    "title": "Medical Volunteer",
    "status": "current",
    "image": "/images/This past Saturday, we had the honour of joining….jpg",
    "alt": "Medical Volunteer",
    "category": "Healthcare",
    "organization": "Health First",
    "location": "Lagos",
    "date": "July 30, 2026",
    "description": "Support doctors and nurses during medical outreach.",
    "buttonText": "Apply Now",
    "disabled": false
  },
  {
    "id": 3,
    "title": "Education For All",
    "status": "upcoming",
    "image": "/images/Education for All.jpg",
    "alt": "Education For All",
    "category": "Education",
    "organization": "Teach Africa",
    "location": "Jos",
    "date": "August 12, 2026",
    "description": "Teach children basic literacy and computer skills.",
    "buttonText": "Apply Now",
    "disabled": false
  },
  {
    "id": 4,
    "title": "Food Relief Campaign",
    "status": "upcoming",
    "image": "/images/save Africans lives.jpg",
    "alt": "Food Relief Campaign",
    "category": "Humanitarian Aid",
    "organization": "Save Lives Initiative",
    "location": "Makurdi",
    "date": "August 20, 2026",
    "description": "Distribute food packages to vulnerable families.",
    "buttonText": "Apply Now",
    "disabled": false
  },
  {
    "id": 5,
    "title": "Environmental Cleanup",
    "status": "finished",
    "image": "/images/COMMUNITY EME.jpg",
    "alt": "Environmental Cleanup",
    "category": "Environment",
    "organization": "Green Earth",
    "location": "Enugu",
    "date": "June 14, 2026",
    "description": "Community sanitation and tree planting exercise.",
    "buttonText": "Closed",
    "disabled": true
  },
  {
    "id": 6,
    "title": "Blood Donation Drive",
    "status": "finished",
    "image": "/images/This past Saturday, we had the honour of joining….jpg",
    "alt": "Blood Donation Drive",
    "category": "Healthcare",
    "organization": "Life Bank",
    "location": "Kano",
    "date": "May 25, 2026",
    "description": "Volunteer during blood donor registration and awareness.",
    "buttonText": "Closed",
    "disabled": true
  },
  {
    "id": 7,
    "title": "Youth Mentorship",
    "status": "current",
    "image": "/images/Education for All.jpg",
    "alt": "Youth Mentorship",
    "category": "Youth Development",
    "organization": "Future Leaders",
    "location": "Ibadan",
    "date": "July 26, 2026",
    "description": "Mentor secondary school students and provide career guidance.",
    "buttonText": "Apply Now",
    "disabled": false
  },
  {
    "id": 8,
    "title": "Disaster Relief Training",
    "status": "upcoming",
    "image": "/images/save Africans lives.jpg",
    "alt": "Disaster Relief Training",
    "category": "Emergency Response",
    "organization": "Rescue Aid",
    "location": "Port Harcourt",
    "date": "September 3, 2026",
    "description": "Learn emergency response while assisting relief coordinators.",
    "buttonText": "Apply Now",
    "disabled": false
  },
  {
    "id": 9,
    "title": "Blood Donation Drive",
    "status": "finished",
    "image": "/images/This past Saturday, we had the honour of joining….jpg",
    "alt": "Blood Donation Drive",
    "category": "Healthcare",
    "organization": "Life Bank",
    "location": "Kano",
    "date": "May 25, 2026",
    "description": "Volunteer during blood donor registration and awareness.",
    "buttonText": "Closed",
    "disabled": true
  }
];


