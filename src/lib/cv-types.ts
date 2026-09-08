export type CvExperience = {
  role: string;
  company: string;
  period: string;
  detail: string;
};

export type CvEducation = {
  degree: string;
  school: string;
  period: string;
};

export type CvData = {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  summary: string;
  experience: CvExperience[];
  education: CvEducation[];
  skills: string[];
};

export const emptyCv: CvData = {
  name: "",
  title: "",
  location: "",
  email: "",
  phone: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

export const sampleCv: CvData = {
  name: "Ayesha Karim",
  title: "Senior Product Designer",
  location: "Lahore, Pakistan",
  email: "ayesha@example.com",
  phone: "+92 300 1234567",
  summary:
    "Design systems and motion for fintech. 7 years shipping accessible, high-traffic products across mobile and web.",
  experience: [
    {
      role: "Lead Designer",
      company: "Vanta Labs",
      period: "2021 – Now",
      detail: "Led a design system serving 40k daily users and cut UI debt by 38%.",
    },
    {
      role: "Product Designer",
      company: "Halcyon",
      period: "2018 – 2021",
      detail: "Built onboarding that lifted activation 22% across mobile and web.",
    },
  ],
  education: [
    { degree: "BSc Computer Science", school: "FAST NUCES", period: "2014 – 2018" },
  ],
  skills: ["Figma", "Design Systems", "Motion", "React", "Prototyping"],
};
