import Modal from "@/components/modal";
import React, { useEffect, useState } from "react";
import UploadData from "./upload-data";
import { RootState } from "@/store/store";
import { User } from "@/store/slices/userSlice";
import { useSelector } from "react-redux";
// import HeartIcon from "@/components/icons/dashboard/chapters/heart-icon";
// import HeartFilledIcon from "@/components/icons/dashboard/chapters/heart-filled-icon";
import CollapsibleIcon from "@/components/icons/dashboard/chapters/collapsable-icon";
import axios from "axios";
import toast from "react-hot-toast";
import EditIcon from "@/components/icons/dashboard/users/edit-icon";
import sectionsTable from "../../../../sectionsTable.json";
import chaptersTable from "../../../../chaptersTable.json";
import ChaptersFilter from "../ChaptersFilter";
import Link from "next/link";
// import UploadFileIconWhite from "@/components/icons/dashboard/chapters/upload-file-icon-white";
import Image from "next/image";

interface SectionProps {
  sectionTitle: string;
  totalChapters: number;
  totalItems: number;
  sectionNumber: string;
  userRole: string;
  children: React.ReactNode;
  handleExport: (chapterIds: number[]) => void;
  chapters: any[];
}

interface ItemProps {
  itemNumber: string;
  status: string;
  pendingCount: string;
  totalItems: number;
  userRole: string;
  isAdmin: boolean, brokerName: string
}

const Section: React.FC<SectionProps> = ({
  sectionTitle,
  totalChapters,
  totalItems,
  children,
  sectionNumber,
  userRole,
  handleExport,
  chapters
}) => {
  // const [isFavorite, setIsFavorite] = useState(false);
  const [isItemsVisible, setIsItemsVisible] = useState(true);



  return (
    <div className="bg-white w-full rounded-2xl mt-4 p-4">

      <div className="flex gap-4">
        <span className="font-semibold text-light-gray">
          Section {sectionNumber}
        </span>

      </div>
      <div className="border rounded-2xl mt-4 overflow-auto">
        <div className="min-w-fit">
          <ChapterHeader
            title={sectionTitle}
            isItemsVisible={isItemsVisible}
            onClick={() => setIsItemsVisible(!isItemsVisible)}
            totalChapters={totalChapters}
            totalItems={totalItems}
            userRole={userRole}
            handleExport={handleExport}
            sectionNo={sectionNumber}
            chapters={chapters}
          />
          {isItemsVisible && children}
        </div>
      </div>
    </div>
  );
};

const Item: React.FC<ItemProps> = ({ itemNumber, status, pendingCount, totalItems, userRole, isAdmin, brokerName }) => (
  <Link href={userRole === "admin" ? "/dashboard/chapters" : `/dashboard/auditing${itemNumber ? "?chapter_no=" + itemNumber : ""}`}>

    <div className="flex gap-4 items-center justify-between p-2 border-t text-nowrap">
      <div className="flex items-center gap-2">
        <span className="bg-[#777777] text-white rounded-full ml-2 py-1 px-4 text-[12px] font-bold">
          {itemNumber}
        </span>

        <span>{status}</span>
      </div>
      <div className="flex items-center gap-2">
        {isAdmin && brokerName && brokerName !== "undefined undefined" && (
          <span className="text-light-blue ms-6 capitalize border border-light-blue rounded-lg px-2">
            {brokerName} <EditIcon className="w-4 h-4 ms-1 inline-block" />
          </span>
        )}
        <span className="ms-auto border-[#B4984C] bg-[#FFEAB0] text-[#B4984C] rounded-full py-1 px-3 text-sm font-bold">
          Pending Items: {pendingCount || 0} out of {totalItems || 0}
        </span>
      </div>
    </div>
  </Link>
);

const ChapterHeader: React.FC<{
  title: string;
  isItemsVisible: boolean;
  onClick: () => void;
  totalChapters: number;
  totalItems: number;
  userRole: string;
  handleExport: (chapterIds: number[]) => void;
  sectionNo: string;
  chapters: any[];
}> = ({ title, isItemsVisible, onClick, totalChapters, totalItems, userRole, handleExport, sectionNo, chapters }) => {
  // Get all chapter IDs for this section from the parent component
  const handleSectionExport = () => {
    const sectionChapterIds = chapters
      ?.filter((item: any) => item?.section_no?.toString() === sectionNo)
      .map((item: any) => item.chapter_no);
    handleExport(sectionChapterIds);
  };

  return (
    <div className="flex gap-4 p-2 ">
      <button onClick={onClick}>
        <CollapsibleIcon
          className={!isItemsVisible ? "rotate-180" : "rotate-0"}
        />
      </button>
      <div className="flex items-center gap-2 w-full text-nowrap">
        <span onClick={onClick} className="text-[20px] leading-[20px] font-semibold text-auth-purple cursor-pointer">
          {title.length > 70 ? title.substring(0, 70) + "..." : title}
        </span>
        <span className="ms-auto text-sm text-auth-purple font-bold bg-[#E7E7E7] px-3 py-2 rounded-full">
          Chapters: {totalChapters}
        </span>
        <span className="text-sm text-auth-purple font-bold bg-[#E7E7E7] px-3 py-2 rounded-full">
          Total Items: {totalItems}
        </span>
        {userRole === "admin" &&
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSectionExport}
              className="px-3 py-2 text-white ms-auto flex items-center font-semibold rounded-full border bg-[#2AB3E7] group relative"
            >
              <Image src="/arrow-down-circle.png" alt="Upload File Icon" width={20} height={20} />
              {/* <UploadFileIconWhite /> */}
              <span className="text-sm ml-2">Download Chapter</span>
            </button>
          </div>}
      </div>
    </div>
  );
};

const Chapters: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userData: User = useSelector((state: RootState) => state.user);
  const [sections] = useState<any[]>(sectionsTable);
  const [chapters, setChapters] = useState<any[]>(chaptersTable);
  const [loading, setLoading] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState({ chapter_no: 0, chapter_name: 'All Item' });
  const [chapterNames] = useState<any[]>([{ chapter_no: 0, chapter_name: 'All Item' }, ...chaptersTable]);

  const handleExport = async (chapterIds: number[] | null) => {
    try {

      const params = new URLSearchParams({
        ...(chapterIds && chapterIds?.length > 0 && { chapter_ids: chapterIds?.toString() }),
      });

      const response = await axios.get(`/api/admin/downloadChapters?${params}`, {
        responseType: 'blob' // Important for handling binary data
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `chapter_items_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const getAllChapters = async (userId: number = 0, chapterId: number = 0) => {
    console.log("chapterId", chapterId);
    // setLoading(true);
    try {
      const response = await axios.get(
        `/api/admin/chapters${userId ? "?user_id=" + userId : ""}${chapterId ? "&chapter_no=" + chapterId : ""}`
      );
      const updatedChapters = chapters?.map((item: any, index: number) => ({
        ...item,
        chapterItems: response?.data?.chapters[index]?.chapterItems
      }));
      setChapters(updatedChapters);


      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Something went wrong!");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    if (userData.role === "admin") {
      getAllChapters();
    } else if (userData.role && userData.id) {
      if (selectedChapters?.chapter_no !== 0) {
        getAllChapters(userData.id, selectedChapters.chapter_no);
      } else {
        getAllChapters(userData.id);
      }
    }
  }, [userData.role, userData.id, selectedChapters]);



  if (loading) {
    return (
      <div className="flex justify-center items-center ">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-light-blue border-solid"></div>
      </div>
    );
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <UploadData onClose={() => setIsOpen(false)} />
      </Modal>
      {userData.role === "admin" && (

      <div className="flex justify-end gap-2">
        <div className="text-right">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-light-blue text-white font-bold rounded-2xl p-2 px-6"
          >
            + Upload Data
          </button>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => handleExport(null)}
            className="px-3 py-2 text-white ms-auto flex items-center font-semibold rounded-2xl border bg-[#2AB3E7] group relative"
          >
            <Image src="/arrow-down-circle.png" alt="Upload File Icon" width={20} height={20} />
            {/* <UploadFileIconWhite /> */}
              <span className="text-sm ml-2">Download All Chapters</span>
            </button>
          </div>
        </div>
      )}

      {(userData.role === "broker" || userData.role === "expert") &&
        ChaptersFilter(selectedChapters, setSelectedChapters, chapterNames)}
      {!sections.length ? (
        <div className="text-center text-auth-purple text-xl italic leading-[100px]">
          Nothing to show
        </div>
      ) : (
        sections.map((section, index) => (
          <Section
            key={index}
            sectionTitle={section.section_name.length > 100 ? section.section_name.substring(0, 100) + "..." : section.section_name}
            totalChapters={chapters?.filter((item: any) => item?.section_no?.toString() === section?.section_no?.toString()).length}
            totalItems={chapters?.filter((item: any) => item?.section_no?.toString() === section?.section_no?.toString()).map((item: any) => item?.chapterItems?.length).reduce((a: number, b: number) => a + b, 0) || 0}
            sectionNumber={String(index + 1)}
            userRole={userData.role}
            handleExport={handleExport}
            chapters={chapters}
          >
            {chapters?.filter((item: any) => item?.section_no?.toString() === section?.section_no?.toString()).map((item: any, itemIndex: number) => (
              <Item
                key={itemIndex}
                itemNumber={item?.chapter_no.toString()}
                status={item?.chapter_name.length > 100 ? item?.chapter_name.substring(0, 100) + "..." : item?.chapter_name}
                pendingCount={item?.chapterItems?.filter((item: any) => item?.status === "new").length}
                totalItems={item?.chapterItems?.length}
                userRole={userData.role}
                brokerName={
                  item?.chapterItems && (item?.chapterItems[0]?.user?.firstName +
                    " " +
                    item?.chapterItems[0]?.user?.lastName)
                }
                isAdmin={userData?.role === "admin"}
              />
            ))}
          </Section>
        ))
      )}
    </div>
  );
};

export default Chapters;
