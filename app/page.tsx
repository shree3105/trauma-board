"use client"; // This is a client component
import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";



const initialPatients = [
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
  {
    id: 2,
    referralDate: "08/05/2025",
    hospitalNumber: "HN654321",
    name: "Jane Smith",
    gender: "Female",
    dob: "22/06/1993",
    age: 32,
    ward: "Ortho B",
    consultant: "Dr. Lee",
    doi: "10/05/2025",
    diagnosis: "Tibial plateau fracture",
    history: "Motor vehicle accident",
    outcome: "Post-Op",
    section: "Hip & Knee",
    theatreSlot: null,
    surgeryDate: null,
    notes: null,
  },
];

function getTheatreDays() {
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

function AutoResizingTextarea({ value, onChange, readOnly = false }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      style={{
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        resize: "none",
        padding: "0.5em",
        lineHeight: "1.4",
        fontFamily: "inherit",
        backgroundColor: readOnly ? "#f9fafb" : "inherit",
        border: readOnly ? "none" : "1px solid #ccc",
        outline: "none",
        pointerEvents: readOnly ? "none" : "auto",
        userSelect: readOnly ? "none" : "auto",
      }}
    />
  );
}

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

const getRowColor = (referralDate) => {
  const parseUKDate = (str) => {
    const [day, month, year] = str.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const daysAgo = (dateString) => {
    const refDate = parseUKDate(dateString);
    const now = new Date();
    const diffTime = now - refDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const days = daysAgo(referralDate);
  if (days >= 14) return "bg-red-100";
  if (days >= 7) return "bg-yellow-100";
  return "";
};




const completedCaseSections = ["Metalwork Review"];

export default function TraumaBoard() {
  const [patients, setPatients] = useState(initialPatients);

  const updatePatient = (id, field, value) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const theatreDays = getTheatreDays();

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

        <TabsContent value="theatre">
          {theatreDays.map((slot) => (
            <div key={slot.key} className="space-y-2">
              <h2 className="text-lg font-semibold bg-gray-100 p-2 rounded-xl">
                {slot.label}
              </h2>
              <table className="min-w-full border text-sm text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Referral Date</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Hospital #</th>
                    <th className="px-2 py-1 border min-w-[140px] max-w-[140px] ">Name</th>
                    <th className="px-2 py-1 border min-w-[80px] max-w-[80px] ">Gender</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px]">DOB</th>
                    <th className="px-2 py-1 border min-w-[40px] max-w-[40px] ">Age</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Ward</th>
                    <th className="px-2 py-1 border min-w-[140px] max-w-[140px] ">Consultant</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">DOI</th>
                    <th className="px-2 py-1 border min-w-[180px] w-[10%]">Diagnosis</th>
                    <th className="px-2 py-1 border min-w-[220px] w-[20%]">History</th>
                    <th className="px-2 py-1 border min-w-[260px] w-[25%]">Outcome</th>
                    <th className="px-2 py-1 border min-w-[400px] max-w-[400px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients
                    .filter((p) => p.theatreSlot === slot.key)
                    .map((p) => (
                      <tr key={p.id} className={`leading-tight ${getRowColor(p.referralDate)}`}>

                        <td className="px-2 py-1 border">{p.referralDate}</td>
                        <td className="px-2 py-1 border">{p.hospitalNumber}</td>
                        <td className="px-2 py-1 border">{p.name}</td>
                        <td className="px-2 py-1 border">{p.gender}</td>
                        <td className="px-2 py-1 border">{p.dob}</td>
                        <td className="px-2 py-1 border">{p.age}</td>
                        <td className="px-2 py-1 border">{p.ward}</td>
                        <td className="px-2 py-1 border">{p.consultant}</td>
                        <td className="px-2 py-1 border">{p.doi}</td>
                        <td className="px-2 py-1 border">
                          <AutoResizingTextarea
                            value={p.diagnosis}
                            onChange={(e) =>
                              updatePatient(p.id, "diagnosis", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border">{p.history}</td>
                        <td className="px-2 py-1 border ">
                          <AutoResizingTextarea
                            value={p.outcome}
                            onChange={(e) =>
                              updatePatient(p.id, "outcome", e.target.value)
                            }
                          />
                        </td>

                        <td className="px-2 py-1 border">
                          <div className="flex flex-wrap gap-1">
                            <Select
                              onValueChange={(val) =>
                                updatePatient(p.id, "theatreSlot", val)
                              }
                            >
                              <SelectTrigger className="w-22 text-xs">
                                <SelectValue placeholder="Move" />
                              </SelectTrigger>
                              <SelectContent>
                                {theatreDays.map((day) => (
                                  <SelectItem key={day.key} value={day.key}>
                                    {day.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              className="w-22 text-xs"
                              onClick={() => {
                                const originalSection =
                                  patients.find((x) => x.id === p.id)
                                    ?.section || "New Cases";

                                updatePatient(p.id, "section", originalSection);
                                updatePatient(p.id, "theatreSlot", null);
                              }}
                            >
                              Return to Board
                            </Button>
                            <Button
                              className="w-22 text-xs"
                              onClick={() => {
                                updatePatient(
                                  p.id,
                                  "section",
                                  "Metalwork Review"
                                );

                               const rawDate = slot.label.match(/\(([^)]+)\)/)?.[1] || slot.label;
updatePatient(p.id, "surgeryDate", rawDate);


                                updatePatient(p.id, "theatreSlot", null);
                              }}
                            >
                              Complete
                            </Button>
                            <Button
                              className="w-22 bg-red-600 text-white hover:bg-red-700 text-xs"
                              onClick={() =>
                                setPatients(
                                  patients.filter((x) => x.id !== p.id)
                                )
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="board">
          {sectionTitles.map((section) => (
            <div key={section} className="space-y-2">
              <h2 className="text-lg font-semibold bg-gray-100 p-2 rounded-xl">
                {section}
                {section === "New Cases" && (
              
  <Button
    
    className="ml-2 mb-2 text-xs"
    onClick={() => {
      const newId = Math.max(...patients.map((p) => p.id)) + 1;
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
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Referral Date</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Hospital #</th>
                    <th className="px-2 py-1 border min-w-[140px] max-w-[140px] ">Name</th>
                    <th className="px-2 py-1 border min-w-[80px] max-w-[80px] ">Gender</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px]">DOB</th>
                    <th className="px-2 py-1 border min-w-[50px] max-w-[50px] ">Age</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Ward</th>
                    <th className="px-2 py-1 border min-w-[140px] max-w-[140px] ">Consultant</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">DOI</th>
                    <th className="px-2 py-1 border min-w-[180px] w-[10%]">Diagnosis</th>
                    <th className="px-2 py-1 border min-w-[220px] w-[20%]">History</th>
                    <th className="px-2 py-1 border min-w-[260px] w-[25%]">Outcome</th>
                    <th className="px-2 py-1 border min-w-[320px] max-w-[320px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients
                    .filter(
                      (p) => p.section === section && p.theatreSlot === null
                    )
                    .map((p) => (
                      <tr key={p.id} className={`leading-tight ${getRowColor(p.referralDate)}`}>

                        <td className="px-2 py-1 border">
                          <input
  type="date"
  value={p.referralDate.split("/").reverse().join("-")}
  onChange={(e) => {
    const formatted = new Date(e.target.value).toLocaleDateString("en-GB");
    updatePatient(p.id, "referralDate", formatted);
  }}
  className="w-full text-sm px-2 py-1 border rounded"
/>


                        </td>
                        <td className="px-2 py-1 border">
                          <AutoResizingTextarea
                            value={p.hospitalNumber}
                            onChange={(e) =>
                              updatePatient(p.id, "hospitalNumber", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border">
                          <AutoResizingTextarea
                            value={p.name}
                            onChange={(e) =>
                              updatePatient(p.id, "name", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border">
                          <AutoResizingTextarea
                            value={p.gender}
                            onChange={(e) =>
                              updatePatient(p.id, "gender", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border">
                          <input
  type="date"
  value={p.dob.split("/").reverse().join("-")}
  onChange={(e) => {
    const formatted = new Date(e.target.value).toLocaleDateString("en-GB");
    updatePatient(p.id, "dob", formatted);
  }}
  className="w-full text-sm px-2 py-1 border rounded"
/>
                        </td>
                        <td className="px-2 py-1 border">
                          <AutoResizingTextarea
                            value={p.age}
                            onChange={(e) =>
                              updatePatient(p.id, "age", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border">
                          <AutoResizingTextarea
                            value={p.ward}
                            onChange={(e) =>
                              updatePatient(p.id, "ward", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border">
                          <AutoResizingTextarea
                            value={p.consultant}
                            onChange={(e) =>
                              updatePatient(p.id, "consultant", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border">
                          <input
  type="date"
  value={p.doi.split("/").reverse().join("-")}
  onChange={(e) => {
    const formatted = new Date(e.target.value).toLocaleDateString("en-GB");
    updatePatient(p.id, "doi", formatted);
  }}
  className="w-full text-sm px-2 py-1 border rounded"
/>
                        </td>
                        <td className="px-2 py-1 border">
                          <AutoResizingTextarea
                            value={p.diagnosis}
                            onChange={(e) =>
                              updatePatient(p.id, "diagnosis", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border ">
                          <AutoResizingTextarea
                            value={p.history}
                            onChange={(e) =>
                              updatePatient(p.id, "history", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border ">
                          <AutoResizingTextarea
                            value={p.outcome}
                            onChange={(e) =>
                              updatePatient(p.id, "outcome", e.target.value)
                            }
                          />
                        </td>

                        <td className="px-2 py-1 border space-y-1">
                          <div className="flex flex-wrap gap-1">
                            <Select
                              onValueChange={(val) =>
                                updatePatient(p.id, "section", val)
                              }
                            >
                              <SelectTrigger className="w-22 text-xs">
                                <SelectValue placeholder="Move" />
                              </SelectTrigger>
                              <SelectContent>
                                {sectionTitles.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              onValueChange={(val) =>
                                updatePatient(p.id, "theatreSlot", val)
                              }
                            >
                              <SelectTrigger className="w-24 text-xs">
                                <SelectValue placeholder="Theatre" />
                              </SelectTrigger>
                              <SelectContent>
                                {theatreDays.map((day) => (
                                  <SelectItem key={day.key} value={day.key}>
                                    {day.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Button
                              className="w-22 text-xs bg-red-600 text-white hover:bg-red-700"
                              onClick={() =>
                                setPatients(
                                  patients.filter((x) => x.id !== p.id)
                                )
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="completed">
          {completedCaseSections.map((section) => (
            <div key={section} className="space-y-2">
              <h2 className="text-lg font-semibold bg-gray-100 p-2 rounded-xl">
                {section}
              </h2>
              <table className="min-w-full border text-sm text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Referral Date</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Hospital #</th>
                    <th className="px-2 py-1 border min-w-[140px] max-w-[140px] ">Name</th>
                    <th className="px-2 py-1 border min-w-[80px] max-w-[80px] ">Gender</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px]">DOB</th>
                    <th className="px-2 py-1 border min-w-[40px] max-w-[40px] ">Age</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Ward</th>
                    <th className="px-2 py-1 border min-w-[140px] max-w-[140px] ">Consultant</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">DOI</th>
                    <th className="px-2 py-1 border min-w-[180px] w-[10%]">Diagnosis</th>
                    <th className="px-2 py-1 border min-w-[220px] w-[20%]">History</th>
                    <th className="px-2 py-1 border min-w-[260px] w-[25%]">Outcome</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px]">Surgery Date</th>
                    <th className="px-2 py-1 border min-w-[120px] max-w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients
                    .filter((p) => p.section === section)
                    .map((p) => (
                      <tr key={p.id} className="even:bg-gray-50">
                        <td className="px-2 py-1 border">{p.referralDate}</td>
                        <td className="px-2 py-1 border">{p.hospitalNumber}</td>
                        <td className="px-2 py-1 border">{p.name}</td>
                        <td className="px-2 py-1 border">{p.gender}</td>
                        <td className="px-2 py-1 border">{p.dob}</td>
                        <td className="px-2 py-1 border">{p.age}</td>
                        <td className="px-2 py-1 border">{p.ward}</td>
                        <td className="px-2 py-1 border">{p.consultant}</td>
                        <td className="px-2 py-1 border">{p.doi}</td>
                        <td className="px-2 py-1 border">
                          <AutoResizingTextarea
                            value={p.diagnosis}
                            onChange={(e) =>
                              updatePatient(p.id, "diagnosis", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border">{p.history}</td>
                        <td className="px-2 py-1 border ">
                          <AutoResizingTextarea
                            value={p.outcome}
                            onChange={(e) =>
                              updatePatient(p.id, "outcome", e.target.value)
                            }
                          />
                        </td>

                        <td className="px-2 py-1 border">
                          {p.surgeryDate}
                        </td>
                        <td className="px-2 py-1 border">
                          <div className="flex flex-wrap gap-1">
                            {section === "Metalwork Review" && (
                              <Button
                                className="w-22 text-xs"
                                onClick={() =>
                                  updatePatient(p.id, "section", "Archive")
                                }
                              >
                                Move to Archive
                              </Button>
                        
                    
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="archive">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold bg-gray-100 p-2 rounded-xl">Archive</h2>
            <table className="min-w-full border text-sm text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Referral Date</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Hospital #</th>
                    <th className="px-2 py-1 border min-w-[140px] max-w-[140px] ">Name</th>
                    <th className="px-2 py-1 border min-w-[80px] max-w-[80px] ">Gender</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px]">DOB</th>
                    <th className="px-2 py-1 border min-w-[40px] max-w-[40px] ">Age</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">Ward</th>
                    <th className="px-2 py-1 border min-w-[140px] max-w-[140px] ">Consultant</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px] ">DOI</th>
                    <th className="px-2 py-1 border min-w-[180px] w-[10%]">Diagnosis</th>
                    <th className="px-2 py-1 border min-w-[220px] w-[20%]">History</th>
                    <th className="px-2 py-1 border min-w-[260px] w-[25%]">Outcome</th>
                    <th className="px-2 py-1 border min-w-[110px] max-w-[110px]">Surgery Date</th>
                  <th className="px-2 py-1 border min-w-[180px] w-[10%]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {patients.filter(p => p.section === "Archive").map(p => (
                  <tr key={p.id} className="even:bg-gray-50">
                    <td className="px-2 py-1 border">{p.referralDate}</td>
                    <td className="px-2 py-1 border">{p.hospitalNumber}</td>
                    <td className="px-2 py-1 border">{p.name}</td>
                    <td className="px-2 py-1 border">{p.gender}</td>
                    <td className="px-2 py-1 border">{p.dob}</td>
                    <td className="px-2 py-1 border">{p.age}</td>
                    <td className="px-2 py-1 border">{p.ward}</td>
                    <td className="px-2 py-1 border">{p.consultant}</td>
                    <td className="px-2 py-1 border">{p.doi}</td>
                    <td className="px-2 py-1 border">{p.diagnosis}</td>
                    <td className="px-2 py-1 border">{p.history}</td>
                    <td className="px-2 py-1 border">{p.outcome}</td>
                    <td className="px-2 py-1 border">{p.surgeryDate || "-"}</td>
                    <td className="px-2 py-1 border">
                      
                       <AutoResizingTextarea
                            value={p.notes}
                            onChange={(e) =>
                              updatePatient(p.id, "notes", e.target.value)
                            }
                          />
                     
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
