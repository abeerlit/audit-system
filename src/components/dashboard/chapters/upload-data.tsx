interface UploadDataProps {
  onClose: () => void;
}

import FilledCheckIcon from "@/components/icons/dashboard/chapters/filled-check-icon";
import UploadFileIcon from "@/components/icons/dashboard/chapters/upload-file-icon";
import { useState } from "react";

const UploadData = ({ onClose }: UploadDataProps) => {
  const [fileName, setFileName] = useState<File | null>(null);
  const [selectedChapters, setSelectedChapters] = useState("");
  const [selectedBroker, setSelectedBroker] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setFileName(file);
      setUploadStatus(`${file.name} is uploaded`);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("File:", fileName);
    console.log("Chapter:", selectedChapters);
    console.log("Broker:", selectedBroker);
    // Reset the form
    setFileName(null);
    setSelectedChapters("");
    setSelectedBroker("");
    setUploadStatus("");
    onClose();
  };

  return (
    <form className="sm:min-w-[400px] text-auth-purple font-semibold" onSubmit={handleSubmit}>
      <h1 className="text-xl font-bold mb-4">Upload files</h1>
      <label
        htmlFor="file-upload"
        className="border border-dashed mb-4 text-center font-bold block border-gray-400 rounded-xl bg-gray-100 p-4 w-full cursor-pointer"
      >
        <UploadFileIcon className="w-8 h-8 mx-auto mb-2" />
        Click to upload
        <input
          hidden
          id="file-upload"
          type="file"
          accept=".xls, .xlsx"
          onChange={handleFileChange}
          className="border border-dashed border-gray-400 p-4 w-full mb-2 cursor-pointer"
        />
      </label>
      {uploadStatus && <p className="bg-[#DCFFDE] px-4 py-1 text-sm font-normal rounded mb-4"> <FilledCheckIcon className="inline-block me-1" /> {uploadStatus}</p>}
      <h2 className="text-xl mb-4">Assign Chapters</h2>
      <h4>Select Chapter</h4>
      <select
        value={selectedChapters}
        onChange={(e) => setSelectedChapters(e.target.value)}
        className="mb-4 p-2 w-full bg-[#F4F7FE] text-light-gray rounded-lg text-sm"
      >
        <option value="">Select Chapter</option>
        <option value="Live Animals">Live Animals</option>
        <option value="Animal Products">Animal Products</option>
      </select>
      <h4>Select Broker</h4>
      <select
        value={selectedBroker}
        onChange={(e) => setSelectedBroker(e.target.value)}
        className="mb-4 p-2 w-full bg-[#F4F7FE] text-light-gray rounded-lg text-sm"
      >
        <option value="">Select Broker</option>
        <option value="Halle Shaw">Halle Shaw</option>
      </select>
      <button
        type="submit"
        className="bg-light-blue text-white font-bold py-2 px-6 rounded-xl"
      >
        Submit
      </button>
    </form>
  );
};

export default UploadData;
