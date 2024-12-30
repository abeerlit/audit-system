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
  chapterName: z.union([
    z.string().min(1, { message: "Please select a chapter" }),
    z.array(z.string()).min(1, { message: "Please select at least one chapter" })
  ]),
  brokerId: z.string().optional(),
  expertId: z.string().optional(),
  file: z.any().refine((file) => file instanceof File, {
    message: "Please upload a file", 
  }),
}).refine((data) => {
  const hasBrokerId = !!data.brokerId;
  const hasExpertId = !!data.expertId;
  // Ensure single chapter for broker, allow multiple for expert
  if (hasBrokerId) {
    return typeof data.chapterName === 'string';
  }
  return true;
}, {
  message: "Broker can only select one chapter",
  path: ["chapterName"]
});
  

const UploadData = ({ onClose }: UploadDataProps) => {
  const [uploadStatus, setUploadStatus] = useState("");
  const [chapters, setChapters] = useState<string[]>([]);;
  const usersData: Users[] = useSelector((state: RootState) => state.users);
  const [selectedRole, setSelectedRole] = useState<'broker' | 'expert' | null>(null);

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

  // Add handler for role selection
  const handleRoleChange = (role: 'broker' | 'expert' | null, value: string) => {
    if (value) {
      setSelectedRole(role);
      // Clear the other field
      setValue(role === 'broker' ? 'expertId' : 'brokerId', '');
      // Reset chapter selection when switching roles
      setValue('chapterName', role === 'broker' ? '' : []);
    } else {
      setSelectedRole(null);
    }
  };

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      toast.loading("Uploading...");
      const formData = new FormData();
      formData.append("file", data.file);
      if (data.brokerId) formData.append("brokerId", data.brokerId);
      if (data.expertId) formData.append("expertId", data.expertId);
      // Append the complete chapterName array
      
      if (Array.isArray(data.chapterName)) {
        formData.append("chapterName", data.chapterName.join('|'));
      }
      // Handle both single and multiple chapters
      if (Array.isArray(data.chapterName)) {
        data.chapterName.forEach((chapter, index) => {
          formData.append(`chapterName[${index}]`, chapter);
        });
      } else {
        formData.append("chapterName", data.chapterName);
      }
      
      console.log("Form data:", formData);
      const response = await axios.post("/api/admin/chapterItems", formData);
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
    const getChapters = async () => {
      try {
        const response = await axios.get("/api/admin/chapters");
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
    getChapters();
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
          multiple={selectedRole === 'expert'}
          {...register("chapterName")}
          className="p-2 w-full max-w-[400px] bg-[#F4F7FE] text-light-gray rounded-lg text-sm"
        >
          {selectedRole === 'broker' ? <option value="">Select Chapter</option> : null}
          {chapters.map((item, index) => (
            <option className="max-w-[400px]" key={index} value={item}>
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
        onChange={(e) => {
          register("brokerId").onChange(e);
          handleRoleChange('broker', e.target.value);
        }}
        className="p-2 w-full bg-[#F4F7FE] text-light-gray rounded-lg text-sm"
      >
        <option value="">Select Broker</option>
        {usersData.filter((user) => user.role === "broker").map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstName} {user.lastName}
          </option>
        ))}
      </select>
      {errors.brokerId && (
        <p className="text-red-500 font-normal text-sm">
          {errors.brokerId.message}
        </p>
      )}
       <h4 className="mt-4">Select Expert</h4>
      <select
        {...register("expertId")}
        onChange={(e) => {
          register("expertId").onChange(e);
          handleRoleChange('expert', e.target.value);
        }}
        className="p-2 w-full bg-[#F4F7FE] text-light-gray rounded-lg text-sm"
      >
        <option value="">Select Expert</option>
        {usersData.filter((user) => user.role === "expert").map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstName} {user.lastName}
          </option>
        ))}
      </select>
      {errors.expertId && (
        <p className="text-red-500 font-normal text-sm">
          {errors.expertId.message}
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
