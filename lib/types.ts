export type Patient = {
  id: number;
  referralDate: string;
  hospitalNumber: string;
  name: string;
  gender: string;
  dob: string;
  
  ward: string;
  consultant: string;
  
  diagnosis: string;
  history: string;
  outcome: string;
  section: string;
  theatreSlot: string | null;
  surgeryDate: string | null;
  notes: string | null;
};
