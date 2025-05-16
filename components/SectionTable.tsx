import React from "react";
import { Patient } from "@/lib/types";
import AutoResizingTextarea from "./AutoResizingTextarea";
import { Button } from "./ui/button";
import { formatDateUK } from "@/lib/formatDate";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { supabase } from "@/lib/supabase";

type SectionTableProps = {
  title: string;
  section: "theatre" | "board" | "completed" | "archive";
  patients: Patient[];
  updatePatient: <K extends keyof Patient>(id: number, field: K, value: Patient[K]) => void;
  theatreKey?: string;
  theatreDays: { label: string; key: string }[];
  setPatients?: React.Dispatch<React.SetStateAction<Patient[]>>;
};

export default function SectionTable({
  title,
  section,
  patients,
  updatePatient,
  theatreKey,
  theatreDays,
  setPatients,
}: SectionTableProps) {
  const getRowColor = (referralDate: string): string => {
    const [d, m, y] = referralDate.split("/").map(Number);
    const refDate = new Date(y, m - 1, d);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 14) return "bg-red-100";
    if (diffDays >= 7) return "bg-yellow-100";
    return "";
  };

 const filteredPatients = patients.filter((p) => {
  if (section === "theatre") return p.theatreSlot === theatreKey;
  if (section === "board")
    return (
      p.section?.toLowerCase() === title.toLowerCase() &&
      p.theatreSlot === null
    );
  return p.section?.toLowerCase() === title.toLowerCase();
});


  const isEditable = (field: keyof Patient): boolean => {
    if (section === "archive") return field === "notes";
    if (section === "completed") return field === "outcome";
    if (section === "theatre") return field === "diagnosis" || field === "outcome";
    return true; // board tab
  };

  const renderTextarea = (field: keyof Patient, value: string | number | null, id: number) =>
    isEditable(field) ? (
      <AutoResizingTextarea
        value={value}
        onChange={(e) => updatePatient(id, field, e.target.value)}
      />
    ) : (
      value
    );

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold bg-gray-100 p-2 rounded-xl">
        {title}
        {section === "board" && title === "New Cases" && setPatients && (
          <Button
            className="ml-2 mb-2 text-xs"
            onClick={async () => {
  const { data, error } = await supabase
    .from("patients")
    .insert({
      referralDate: "",  // all fields as blank or default
      hospitalNumber: "",
      name: "",
      gender: "",
      dob: "",
      age: "",
      ward: "",
      consultant: "",
      doi: "",
      diagnosis: "",
      history: "",
      outcome: "",
      section: "New Cases",
      theatreSlot: null,
      surgeryDate: null,
      notes: null,
    })
    .select();

  if (error) {
    console.error("Failed to add new patient:", error);
  } else {
    console.log("New patient created:", data);
    // Let realtime update take care of adding it to local state
  }
}}
          >
            + Add New
          </Button>
        )}
      </h2>

      <table className="min-w-full border text-xs text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-2 py-1 border min-w-[100px] max-w-[100px] ">Referral Date</th>
                    <th className="px-2 py-1 border min-w-[100px] max-w-[100px] ">Hospital #</th>
                    <th className="px-2 py-1 border min-w-[120px] max-w-[120px] ">Name</th>
                    <th className="px-2 py-1 border min-w-[60px] max-w-[60px] ">Gender</th>
                    <th className="px-2 py-1 border min-w-[100px] max-w-[100px]">DOB</th>
                    <th className="px-2 py-1 border min-w-[50px] max-w-[50px] ">Age</th>
                    <th className="px-2 py-1 border min-w-[90px] max-w-[90px] ">Ward</th>
                    <th className="px-2 py-1 border min-w-[140px] max-w-[140px] ">Consultant</th>
                    <th className="px-2 py-1 border min-w-[100px] max-w-[100px] ">DOI</th>
                    <th className="px-2 py-1 border min-w-[180px] w-[10%]">Diagnosis</th>
                    <th className="px-2 py-1 border min-w-[220px] w-[20%]">History</th>
                    <th className="px-2 py-1 border min-w-[260px] w-[25%]">Outcome</th>
            {(section === "completed" || section === "archive") && (
              <th className="px-2 py-1 border min-w-[110px] max-w-[110px]">Surgery Date</th>
            )}
            {section === "archive" ? (
              <th className="px-2 py-1 border min-w-[180px] w-[10%]">Notes</th>
            ) : (
              <th className="px-2 py-1 border min-w-[400px] max-w-[400px]">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredPatients.map((p) => (
            <tr key={p.id} className={`leading-tight ${getRowColor(p.referralDate)}`}>
              <td className="px-2 py-1 border">
                {isEditable("referralDate") ? (
                  <input
                    type="date"
                    value={p.referralDate.split("/").reverse().join("-")}
                    onChange={(e) =>
                      updatePatient(
                        p.id,
                        "referralDate",
                        new Date(e.target.value).toLocaleDateString("en-GB")
                      )
                    }
                    className="w-full text-xs px-2 py-1 border rounded"
                  />
                ) : (
                  formatDateUK(p.referralDate)
                )}
              </td>
              <td className="px-2 py-1 border">{renderTextarea("hospitalNumber", p.hospitalNumber, p.id)}</td>
              <td className="px-2 py-1 border">{renderTextarea("name", p.name, p.id)}</td>
              <td className="px-2 py-1 border">{renderTextarea("gender", p.gender, p.id)}</td>
              <td className="px-2 py-1 border">
                {isEditable("dob") ? (
                  <input
                    type="date"
                    value={p.dob.split("/").reverse().join("-")}
                    onChange={(e) =>
                      updatePatient(p.id, "dob", new Date(e.target.value).toLocaleDateString("en-GB"))
                    }
                    className="w-full text-xs px-2 py-1 border rounded"
                  />
                ) : (
                  formatDateUK(p.dob)
                )}
              </td>
              <td className="px-2 py-1 border">{renderTextarea("age", p.age, p.id)}</td>
              <td className="px-2 py-1 border">{renderTextarea("ward", p.ward, p.id)}</td>
              <td className="px-2 py-1 border">{renderTextarea("consultant", p.consultant, p.id)}</td>
              <td className="px-2 py-1 border">
                {isEditable("doi") ? (
                  <input
                    type="date"
                    value={p.doi.split("/").reverse().join("-")}
                    onChange={(e) =>
                      updatePatient(p.id, "doi", new Date(e.target.value).toLocaleDateString("en-GB"))
                    }
                    className="w-full text-xs px-2 py-1 border rounded"
                  />
                ) : (
                  formatDateUK(p.doi)
                )}
              </td>
              <td className="px-2 py-1 border">{renderTextarea("diagnosis", p.diagnosis, p.id)}</td>
              <td className="px-2 py-1 border">{renderTextarea("history", p.history, p.id)}</td>
              <td className="px-2 py-1 border">{renderTextarea("outcome", p.outcome, p.id)}</td>
              {section === "completed" || section === "archive" ? (
                <td className="px-2 py-1 border">{p.surgeryDate ?? "-"}</td>
              ) : null}
              {section === "archive" ? (
                <td className="px-2 py-1 border">{renderTextarea("notes", p.notes, p.id)}</td>
              ) : (
                <td className="px-2 py-1 border">
                  <div className="flex flex-wrap gap-1">
                    {section === "board" && (
                      <>
                        <Select
                          onValueChange={(val) => updatePatient(p.id, "section", val)}
                        >
                          <SelectTrigger className="w-24 text-xs">
                            <SelectValue placeholder="Move" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "New Cases",
                              "Awaiting Surgery",
                              "Hip & Knee",
                              "Foot & Ankle",
                              "Shoulder & Elbow",
                              "Hand",
                              "Discussion",
                              "Onward Referrals",
                            ].map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(val) => updatePatient(p.id, "theatreSlot", val)}
                        >
                          <SelectTrigger className="w-24 text-xs">
                            <SelectValue placeholder="Theatre" />
                          </SelectTrigger>
                          <SelectContent>
                            {theatreDays.map((d) => (
                              <SelectItem key={d.key} value={d.key}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                    {section === "theatre" && (
                      <>
                        <Select
                          onValueChange={(val) => updatePatient(p.id, "theatreSlot", val)}
                        >
                          <SelectTrigger className="w-24 text-xs">
                            <SelectValue placeholder="Theatre" />
                          </SelectTrigger>
                          <SelectContent>
                            {theatreDays.map((d) => (
                              <SelectItem key={d.key} value={d.key}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          className="w-22 text-xs"
                          onClick={() => {
                            updatePatient(p.id, "theatreSlot", null);
                          }}
                        >
                          Return to Board
                        </Button>
                        <Button
                          className="w-22 text-xs"
                          onClick={() => {
                            const rawDate = theatreDays.find((d) => d.key === p.theatreSlot)
                              ?.label.match(/\(([^)]+)\)/)?.[1];
                            if (rawDate) {
                              updatePatient(p.id, "surgeryDate", rawDate);
                            }
                            updatePatient(p.id, "section", "Metalwork Review");
                            updatePatient(p.id, "theatreSlot", null);
                          }}
                        >
                          Complete
                        </Button>
                      </>
                    )}
                    {section === "completed" && title === "Metalwork Review" && (
                      <Button
                        className="w-22 text-xs"
                        onClick={() => updatePatient(p.id, "section", "Archive")}
                      >
                        Move to Archive
                      </Button>
                    )}
                    {setPatients && (
                      <Button
  className="w-22 text-xs bg-red-600 text-white hover:bg-red-700"
  onClick={async () => {
    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", p.id);

    if (error) {
      console.error("Failed to delete:", error.message);
    }
    // No need to manually update state — realtime handles it!
  }}
>
  Delete
</Button>

                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
