import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import FilledCheckIcon from "@/components/icons/dashboard/chapters/filled-check-icon";
import UploadFileIcon from "@/components/icons/dashboard/chapters/upload-file-icon";
import { useEffect, useState } from "react";
import { Users } from "@/store/slices/usersSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface UploadDataProps {
  onClose: () => void;
}

// Define Zod schema with validation and error messages
const schema = z.object({
  chapterName: z.string().min(1, { message: "Please select a chapter" }),
  brokerId: z.string().min(1, { message: "Please select a broker" }),
  // File validation that checks for File instance
  file: z.any().refine((file) => file instanceof File, {
    message: "Please upload a file",
  }),
});

const UploadData = ({ onClose }: UploadDataProps) => {
  const [uploadStatus, setUploadStatus] = useState("");
  const [chapters, setChapters] = useState<string[]>([]);;
  const usersData: Users[] = useSelector((state: RootState) => state.users);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  // Update file state and form field on file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("file", file); // Properly set file instance in form data
      setUploadStatus(`${file.name} is uploaded`);
    }
  };

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      toast.loading("Uploading...");
      const formData = new FormData();
      formData.append("file", data.file); // Ensure file is uploaded properly
      formData.append("brokerId", data.brokerId);
      formData.append("chapterName", data.chapterName);
      
      console.log("Form data:", formData);
      const response = await axios.post("/api/admin/chapters", formData);
      console.log("response", response.data);

      toast.dismiss();
      toast.success("Upload successful!");
      onClose();
    } catch (error) {
      toast.dismiss();
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.log(error, "error in catch");
    }
  };

  useEffect(() => {
    const getChapterNames = async () => {
      try {
        const response = await axios.get("/api/admin/chapterNames");
        setChapters(response.data.chapters.map((chapter: any) => chapter.chapter_name));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data?.message || "An error occurred");
        } else {
          toast.error("An unexpected error occurred");
        }
        console.log(error, "error in catch");
      }
    };
    getChapterNames();
  },[])

  return (
    <form
      className="sm:min-w-[400px] text-auth-purple font-semibold"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-bold mb-4">Upload files</h1>
      <label
        htmlFor="file-upload"
        className="border border-dashed text-center font-bold block border-gray-400 rounded-xl bg-gray-100 p-4 w-full cursor-pointer"
      >
        <UploadFileIcon className="w-8 h-8 mx-auto mb-2" />
        Click to upload
        <input
          {...register("file")}
          hidden
          id="file-upload"
          type="file"
          accept=".xls, .xlsx"
          onChange={handleFileChange}
          className="border border-dashed border-gray-400 p-4 w-full mb-2 cursor-pointer"
        />
      </label>
      {errors.file && (
        <p className="text-red-500 font-normal text-sm">{errors.file.message}</p>
      )}
      {uploadStatus && (
        <p className="bg-[#DCFFDE] px-4 py-1 text-sm font-normal rounded mt-4">
          <FilledCheckIcon className="inline-block me-1" /> {uploadStatus}
        </p>
      )}
      <h2 className="text-xl my-4">Assign Chapters</h2>
      <h4>Select Chapter</h4>
      <select
        {...register("chapterName")}
        className="p-2 w-full bg-[#F4F7FE] text-light-gray rounded-lg text-sm"
      >
        <option value="">Select Chapter</option>
        {chapters.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
      {errors.chapterName && (
        <p className="text-red-500 font-normal text-sm">
          {errors.chapterName.message}
        </p>
      )}
      <h4 className="mt-4">Select Broker</h4>
      <select
        {...register("brokerId")}
        className="p-2 w-full bg-[#F4F7FE] text-light-gray rounded-lg text-sm"
      >
        <option value="">Select Broker</option>
        {usersData.map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstName}
          </option>
        ))}
      </select>
      {errors.brokerId && (
        <p className="text-red-500 font-normal text-sm">
          {errors.brokerId.message}
        </p>
      )}
      <button
        type="submit"
        className="mt-4 bg-light-blue text-white font-bold py-2 px-6 rounded-xl"
      >
        Submit
      </button>
    </form>
  );
};

export default UploadData;
