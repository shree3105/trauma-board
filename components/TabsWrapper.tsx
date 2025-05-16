"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { getTheatreDays } from "@/lib/data";
import { Patient } from "@/lib/types";
import SectionTable from "./SectionTable";
import LogoutButton from "@/components/LogoutButton";

const sectionTitles = [
  "New Cases",
  "Awaiting Surgery",
  "Hip & Knee",
  "Foot & Ankle",
  "Shoulder & Elbow",
  "Hand",
  "Discussion",
  "Onward Referrals",
];

const completedCaseSections = ["Metalwork Review"];
const archiveSection = ["Archive"];

export default function TabsWrapper() {
  const [patients, setPatients] = useState<Patient[]>([]);
   // ✅ Fetch patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
  const { data, error } = await supabase.from("patients").select("*");

  if (error) {
    console.error("Error fetching patients:", error.message);
  } else {
    console.log("Fetched patients:", data);
    setPatients(data || []);
  }
};
    fetchPatients();
  }, []);

  // ✅ Realtime updates
  useEffect(() => {
  const channel = supabase
    .channel("realtime:patients")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "patients",
      },
      (payload) => {
        if (payload.eventType === "DELETE") {
          const deletedId = (payload.old as Patient).id;
          setPatients((prev) => prev.filter((p) => p.id !== deletedId));
        } else if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const updated = payload.new as Patient;
          setPatients((prev) => {
            const exists = prev.find((p) => p.id === updated.id);
            if (exists) {
              return prev.map((p) => (p.id === updated.id ? updated : p));
            } else {
              return [...prev, updated]; // new insert
            }
          });
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);









  const theatreDays = getTheatreDays();

  const updatePatient = async <K extends keyof Patient>(
  id: number,
  field: K,
  value: Patient[K]
) => {
  const { error } = await supabase
    .from("patients")
    .update({ [field]: value })
    .eq("id", id);

  if (error) {
    console.error("Update failed:", error);
  } else {
    // Optimistically update local state
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }
};



  return (
    <div className="p-6 space-y-6">
      
      <div className="flex justify-between items-center">
  <h1 className="text-2xl font-bold">Orthopaedic Trauma Board</h1>
  <LogoutButton />
</div>
      <Tabs defaultValue="board" className="space-y-4">
        <TabsList>
          <TabsTrigger value="theatre">Theatre List</TabsTrigger>
          <TabsTrigger value="board">Trauma Board</TabsTrigger>
          <TabsTrigger value="completed">Completed Cases</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        {/* Theatre Tab */}
        <TabsContent value="theatre">
          {theatreDays.map((slot) => (
            <SectionTable
              key={slot.key}
              title={slot.label}
              patients={patients}
              updatePatient={updatePatient}
              section="theatre"
              theatreKey={slot.key}
              theatreDays={theatreDays}
              setPatients={setPatients}
            />
          ))}
        </TabsContent>

        {/* Trauma Board Tab */}
        <TabsContent value="board">
          {sectionTitles.map((section) => (
            <SectionTable
              key={section}
              title={section}
              patients={patients}
              updatePatient={updatePatient}
              section="board"
              theatreDays={theatreDays}
              setPatients={setPatients}
              
            />
          ))}
        </TabsContent>

        {/* Completed Cases Tab */}
        <TabsContent value="completed">
          {completedCaseSections.map((section) => (
            <SectionTable
              key={section}
              title={section}
              patients={patients}
              updatePatient={updatePatient}
              section="completed"
              theatreDays={theatreDays}
            />
          ))}
        </TabsContent>

        {/* Archive Tab */}
        <TabsContent value="archive">
          {archiveSection.map((section) => (
            <SectionTable
              key={section}
              title={section}
              patients={patients}
              updatePatient={updatePatient}
              section="archive"
              theatreDays={theatreDays}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
