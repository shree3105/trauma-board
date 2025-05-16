"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { initialPatients, getTheatreDays } from "@/lib/data";
import { Patient } from "@/lib/types";
import SectionTable from "./SectionTable";

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
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const theatreDays = getTheatreDays();

  const updatePatient = (
    id: number,
    field: keyof Patient,
    value: Patient[keyof Patient]
  ) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Orthopaedic Trauma Board</h1>
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
              isBoard={true}
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
