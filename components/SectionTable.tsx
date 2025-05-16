import React from "react";
import { Patient } from "@/lib/types";
import AutoResizingTextarea from "./AutoResizingTextarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

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
    if (section === "board") return p.section === title && p.theatreSlot === null;
    return p.section === title;
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
            onClick={() => {
              const newId = Math.max(0, ...patients.map((p) => p.id)) + 1;
              setPatients([
                ...patients,
                {
                  id: newId,
                  referralDate: "",
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
                },
              ]);
            }}
          >
            + Add New
          </Button>
        )}
      </h2>

      <table className="min-w-full border text-sm text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-2 py-1 border">Referral Date</th>
            <th className="px-2 py-1 border">Hospital #</th>
            <th className="px-2 py-1 border">Name</th>
            <th className="px-2 py-1 border">Gender</th>
            <th className="px-2 py-1 border">DOB</th>
            <th className="px-2 py-1 border">Age</th>
            <th className="px-2 py-1 border">Ward</th>
            <th className="px-2 py-1 border">Consultant</th>
            <th className="px-2 py-1 border">DOI</th>
            <th className="px-2 py-1 border">Diagnosis</th>
            <th className="px-2 py-1 border">History</th>
            <th className="px-2 py-1 border">Outcome</th>
            {(section === "completed" || section === "archive") && (
              <th className="px-2 py-1 border">Surgery Date</th>
            )}
            {section === "archive" ? (
              <th className="px-2 py-1 border">Notes</th>
            ) : (
              <th className="px-2 py-1 border">Actions</th>
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
                    className="w-full text-sm px-2 py-1 border rounded"
                  />
                ) : (
                  p.referralDate
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
                    className="w-full text-sm px-2 py-1 border rounded"
                  />
                ) : (
                  p.dob
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
                    className="w-full text-sm px-2 py-1 border rounded"
                  />
                ) : (
                  p.doi
                )}
              </td>
              <td className="px-2 py-1 border">{renderTextarea("diagnosis", p.diagnosis, p.id)}</td>
              <td className="px-2 py-1 border">{p.history}</td>
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
                        onClick={() =>
                          setPatients((prev) => prev.filter((x) => x.id !== p.id))
                        }
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
