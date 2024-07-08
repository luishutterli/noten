import React from "react";

const exams = [
  { Fach: "Mathematik", Datum: "2023-04-01", Name: "Algebra Test", Note: "5.5", Gewicht: "2" },
  { Fach: "Informatik", Datum: "2023-04-05", Name: "Datenstrukturen", Note: "6.0", Gewicht: "2" },
  { Fach: "Englisch", Datum: "2023-04-10", Name: "Vokabeltest", Note: "5.0", Gewicht: "1" },
];

const GradeList = () => {
  return (
    <div className="flex justify-center p-5">
        <table className="w-1/2 table-auto border-collapse shadow-lg bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-start border px-4 py-2">Fach</th>
              <th className="text-start border px-4 py-2">Datum</th>
              <th className="text-start border px-4 py-2">Name</th>
              <th className="text-start border px-4 py-2">Note</th>
              <th className="text-start border px-4 py-2">Gewicht</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, index) => (
              <tr key={index} className="even:bg-gray-100">
                <td className="border px-4 py-2">{exam.Fach}</td>
                <td className="border px-4 py-2">{exam.Datum}</td>
                <td className="border px-4 py-2">{exam.Name}</td>
                <td className="text-end border px-4 py-2">{exam.Note}</td>
                <td className="text-end border px-4 py-2">{exam.Gewicht}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default GradeList;