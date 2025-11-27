// Dados de desemprego Ontario (fonte: StatCan)

const unemploymentData = [
    { year: 2019, youth: 11.8, adult: 4.3 },
    { year: 2020, youth: 24.9, adult: 7.4 },
    { year: 2021, youth: 16.0, adult: 6.4 },
    { year: 2022, youth: 9.5,  adult: 4.6 },
    { year: 2023, youth: 15.3, adult: 3.8 },
    { year: 2024, youth: 17.9, adult: 4.7 },
    { year: 2025, youth: 18.2, adult: 7.1 }
];

// Disponibiliza globalmente
window.unemploymentData = unemploymentData;


// Occupations Risk Data (Marcus Scene)
const occupationsData = [
  { occupation: "Data Entry Clerks", percentage: 87, exposed: true },
  { occupation: "Telemarketing Sales Representatives", percentage: 84, exposed: true },
  { occupation: "Bookkeepers", percentage: 82, exposed: true },
  { occupation: "Customer Service Representatives", percentage: 79, exposed: true },
  { occupation: "Software Developers (Junior Level)", percentage: 76, exposed: true },
  { occupation: "Paralegal Assistants", percentage: 74, exposed: true },
  { occupation: "Legal Secretaries", percentage: 71, exposed: true },
  { occupation: "Administrative Assistants", percentage: 68, exposed: false },
  { occupation: "Proofreaders & Copy Editors", percentage: 65, exposed: false },
  { occupation: "Transcriptionists", percentage: 63, exposed: false }
];

const aiJobsData = [
  { sector: "Big Data", jobs: 110, growth: 110 },
  { sector: "FinTech Engineers", jobs: 90, growth: 90 },
  { sector: "AI and ML", jobs: 80, growth: 80 },
  { sector: "Software Dev", jobs: 65, growth: 65 },
  { sector: "Security Management", jobs: 60, growth: 60 },
  { sector: "Data Warehousing", jobs: 58, growth: 58 },
  { sector: "Autonomous Vehicle", jobs: 55, growth: 55 },
  { sector: "UI/UX Designers", jobs: 50, growth: 50 },
  { sector: "Internet of Things", jobs: 46, growth: 46 },
  { sector: "Data Analysts", jobs: 44, growth: 44 },
  { sector: "Environmental", jobs: 42, growth: 42 },
  { sector: "Information Security", jobs: 41, growth: 41 },
  { sector: "DevOps Engineer", jobs: 40, growth: 40 },
  { sector: "Renewable Energy", jobs: 39, growth: 39 }
];



// CENA 6: SKILLS CLUSTER 
const skillsData = {
    name: "Top Skills",
    children: [
        {
            name: "Technical",
            children: [
                { name: "Data Literacy", value: 90 },
                { name: "AI Ethics", value: 85 },
                { name: "Python/R", value: 80 },
                { name: "Prompt Eng.", value: 75 },
                { name: "Cloud", value: 70 }
            ]
        },
        {
            name: "Human",
            children: [
                { name: "Adaptability", value: 95 },
                { name: "Crit. Thinking", value: 92 },
                { name: "Empathy", value: 88 },
                { name: "Communication", value: 85 },
                { name: "Leadership", value: 78 }
            ]
        }
    ]
};
