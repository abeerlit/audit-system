import Modal from "@/components/modal";
import React, { useEffect, useState } from "react";
import UploadData from "./upload-data";
import { RootState } from "@/store/store";
import { User } from "@/store/slices/userSlice";
import { useSelector } from "react-redux";
import HeartIcon from "@/components/icons/dashboard/chapters/heart-icon";
import HeartFilledIcon from "@/components/icons/dashboard/chapters/heart-filled-icon";
import CollapsibleIcon from "@/components/icons/dashboard/chapters/collapsable-icon";
import axios from "axios";
import toast from "react-hot-toast";
import EditIcon from "@/components/icons/dashboard/users/edit-icon";

interface SectionProps {
  sectionTitle: string;
  totalChapters: number;
  totalItems: number;
  sectionNumber: string;
  brokerName: string;
  isAdmin: boolean;
  children: React.ReactNode;
}

interface ItemProps {
  itemNumber: string;
  status: string;
  pendingCount: string;
}

const Section: React.FC<SectionProps> = ({
  sectionTitle,
  totalChapters,
  totalItems,
  children,
  sectionNumber,
  brokerName,
  isAdmin,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isItemsVisible, setIsItemsVisible] = useState(true);

  return (
    <div className="bg-white w-full rounded-2xl mt-4 p-4">
      <div className="flex gap-4">
        <span className="font-semibold text-light-gray">
          Section {sectionNumber}
        </span>
        {isAdmin ? (
          <span className="text-light-blue ms-6 capitalize border border-light-blue rounded-lg px-2">
            {brokerName} <EditIcon className="w-4 h-4 ms-1 inline-block" />
          </span>
        ) : (
          <button
            className="ms-auto"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            {isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
          </button>
        )}
      </div>
      <div className="border rounded-2xl mt-4 overflow-auto">
        <div className="min-w-fit">
          <ChapterHeader
            title={sectionTitle}
            isItemsVisible={isItemsVisible}
            onClick={() => setIsItemsVisible(!isItemsVisible)}
            totalChapters={totalChapters}
            totalItems={totalItems}
          />
          {isItemsVisible && children}
        </div>
      </div>
    </div>
  );
};

const Item: React.FC<ItemProps> = ({ itemNumber, status, pendingCount }) => (
  <div className="flex gap-4 items-center p-2 border-t text-nowrap">
    <span className="bg-[#777777] text-white rounded-full ml-2 py-1 px-4 text-[12px] font-bold">
      {itemNumber}
    </span>
    <span>{status}</span>
    <span className="ms-auto border-[#B4984C] bg-[#FFEAB0] text-[#B4984C] rounded-full py-1 px-3 text-sm font-bold">
      Pending Items: {pendingCount}
    </span>
  </div>
);

const ChapterHeader: React.FC<{
  title: string;
  isItemsVisible: boolean;
  onClick: () => void;
  totalChapters: number;
  totalItems: number;
}> = ({ title, isItemsVisible, onClick, totalChapters, totalItems }) => (
  <div className="flex gap-4 p-2 cursor-pointer" onClick={onClick}>
    <button>
      <CollapsibleIcon
        className={!isItemsVisible ? "rotate-180" : "rotate-0"}
      />
    </button>
    <div className="flex items-center gap-2 w-full text-nowrap">
      <span className="text-[20px] leading-[20px] font-semibold text-auth-purple">
        {title}
      </span>
      <span className="ms-auto text-sm text-auth-purple font-bold bg-[#E7E7E7] px-3 py-1 rounded-full">
        Chapters: {totalChapters}
      </span>
      <span className="text-sm text-auth-purple font-bold bg-[#E7E7E7] px-3 py-1 rounded-full">
        Total Items: {totalItems}
      </span>
    </div>
  </div>
);

const Chapters: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userData: User = useSelector((state: RootState) => state.user);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllChapters = async (userId: number = 0) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/admin/chapters${userId ? "?broker_id=" + userId : ""}`
      );
      setChapters(response.data.chapters);
      console.log("getAllChapters response", response.data.chapters);
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
      getAllChapters(userData.id);
    }
  }, [userData.role, userData.id]);

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
      {/* userData.role === "admin" */}
      {userData.role === "admin" && (
        <div className="text-right">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-light-blue text-white font-bold rounded-2xl p-2 px-6"
          >
            + Upload Data
          </button>
        </div>
      )}
      {!chapters.length ? (
        <div className="text-center text-auth-purple text-xl italic leading-[100px]">
          Nothing to show
        </div>
      ) : (
        chapters.map((section, index) => (
          <Section
            key={index}
            sectionTitle={section.chapter_name}
            totalChapters={1}
            totalItems={section?.chapterItems?.length}
            sectionNumber={String(index + 1)}
            brokerName={
              section?.brokerName?.firstName +
              " " +
              section?.brokerName?.lastName
            }
            isAdmin={userData.role === "admin"}
          >
            {section?.chapterItems?.map((item: any, itemIndex: number) => (
              <Item
                key={itemIndex}
                itemNumber={String(itemIndex + 1)}
                status={item?.search_sentence}
                pendingCount={String(0)}
              />
            ))}
          </Section>
        ))
      )}
    </div>
  );
};

export default Chapters;
