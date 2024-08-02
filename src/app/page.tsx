"use client";
import { useState } from "react";
import Select from "react-select";

interface ApiResponse {
  alphabets?: string[];
  numbers?: number[];
  highest_alphabet?: string[];
}

interface Option {
  value: string;
  label: string;
}

function App() {
  const [jsonInput, setJsonInput] = useState<string>('{"data": ["A","C","z"]}');
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid input format");
      }
      setError("");

      const apiResponse = await fetch("https://bfhl-app.onrender.com/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const data = await apiResponse.json() as ApiResponse;
      console.log("API Response:", data);
      setResponse(data);
    } catch (e) {
      setError("Error: " + e.message);
      console.error(e);
    }
  };

  const handleDropdownChange = (selectedOptions: Option[]) => {
    setSelectedOptions(selectedOptions.map((option) => option.value));
  };

  const renderResponse = () => {
    if (!response) return null;

    console.log("Rendering response:", response);

    let filteredResponse: string[] = [];

    if (typeof response === "object" && response !== null) {
      if (selectedOptions.includes("Alphabets") && response.alphabets) {
        filteredResponse.push("Alphabets: " + response.alphabets.join(", "));
      }
      if (selectedOptions.includes("Numbers") && response.numbers) {
        filteredResponse.push("Numbers: " + response.numbers.join(", "));
      }
      if (
        selectedOptions.includes("Highest alphabet") &&
        response.highest_alphabet
      ) {
        filteredResponse.push(
          "Highest alphabet: " + response.highest_alphabet[0]
        );
      }
    }

    return (
      <ul className="list-disc list-inside">
        {filteredResponse.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  const options: Option[] = [
    { value: "Alphabets", label: "Alphabets" },
    { value: "Numbers", label: "Numbers" },
    { value: "Highest alphabet", label: "Highest alphabet" },
  ];

  // Custom styles for react-select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'gray',
      borderColor: 'gray',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'darkgray',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'gray',
      color: 'black',
    }),
    menuList: (provided: any) => ({
      ...provided,
      backgroundColor: 'gray',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'darkgray' : 'gray',
      color: 'black',
      '&:hover': {
        backgroundColor: 'darkgray',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'black',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'black',
    }),
  };

  return (
    <div className="text-center max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JSON Input Form</h1>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON here (e.g., {"data": ["A","C","z"]})'
        className="w-full min-h-[100px] mb-2 p-2 border border-gray-300 rounded text-black"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
      >
        Submit
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}

      {response && (
        <>
          <Select
            isMulti
            options={options}
            onChange={handleDropdownChange}
            styles={customStyles}
            className="mt-4"
          />
          <div className="mt-4">{renderResponse()}</div>
        </>
      )}
    </div>
  );
}

export default App;
