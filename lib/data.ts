export const initialPatients: Patient[] = [
  {
    id: 1,
    referralDate: "10/04/2025",
    hospitalNumber: "HN123456",
    name: "John Doe",
    gender: "Male",
    dob: "15/04/1980",
    age: 45,
    ward: "Trauma A",
    consultant: "Dr. Smith",
    doi: "09/05/2025",
    diagnosis: "Femur fracture",
    history: "Fall from height",
    outcome: "Pending Surgery",
    section: "Awaiting Surgery",
    theatreSlot: null,
    surgeryDate: null,
    notes: null,
  },
  // Add more here
];

export function getTheatreDays() {
  const today = new Date();
  const days = [];
  for (let i = -1; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
    const fullDate = date.toLocaleDateString("en-GB");
    days.push({ label: `${weekday} AM (${fullDate})`, key: `${fullDate}-AM` });
    days.push({ label: `${weekday} PM (${fullDate})`, key: `${fullDate}-PM` });
  }
  return days;
}
