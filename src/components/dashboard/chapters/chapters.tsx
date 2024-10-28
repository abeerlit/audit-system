import Modal from "@/components/modal";
import React, { useState } from "react";
import UploadData from "./upload-data";
import { RootState } from "@/store/store";
import { User } from "@/store/slices/userSlice";
import { useSelector } from "react-redux";
import HeartIcon from "@/components/icons/dashboard/chapters/heart-icon";
import HeartFilledIcon from "@/components/icons/dashboard/chapters/heart-filled-icon";
import CollapsibleIcon from "@/components/icons/dashboard/chapters/collapsable-icon";

interface SectionProps {
  sectionTitle: string;
  totalChapters: number;
  totalItems: number;
  sectionNumber: string;
  children: React.ReactNode;
}

interface ItemProps {
  itemNumber: string;
  status: string;
  pendingCount: string;
}

const sectionsData = [
  {
    sectionTitle: "Live Animals; Animal Products",
    totalChapters: 12,
    totalItems: 400,
    sectionNumber: "01",
    items: [
      {
        itemNumber: "01",
        status: "This document is for verification",
        pendingCount: "03 out of 26",
      },
    ],
  },
  {
    sectionTitle: "Vegetable Products",
    totalChapters: 12,
    totalItems: 400,
    sectionNumber: "02",
    items: [
      {
        itemNumber: "021",
        status: "This document is for verification",
        pendingCount: "03 out of 26",
      },
      {
        itemNumber: "022",
        status: "This document is for verification",
        pendingCount: "05 out of 10",
      },
      {
        itemNumber: "023",
        status: "This document is for verification",
        pendingCount: "07 out of 20",
      },
      {
        itemNumber: "024",
        status: "This document is for verification",
        pendingCount: "08 out of 22",
      },
    ],
  },
  {
    sectionTitle: "Mineral Products",
    totalChapters: 12,
    totalItems: 400,
    sectionNumber: "03",
    items: [
      {
        itemNumber: "03",
        status: "This document is for verification",
        pendingCount: "07 out of 20",
      },
    ],
  },
  {
    sectionTitle: "Prepared Foodstuff",
    totalChapters: 12,
    totalItems: 400,
    sectionNumber: "04",
    items: [
      {
        itemNumber: "041",
        status: "This document is for verification",
        pendingCount: "03 out of 26",
      },
      {
        itemNumber: "042",
        status: "This document is for verification",
        pendingCount: "07 out of 20",
      },
    ],
  },
];

const Section: React.FC<SectionProps> = ({
  sectionTitle,
  totalChapters,
  totalItems,
  children,
  sectionNumber,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isItemsVisible, setIsItemsVisible] = useState(true);

  return (
    <div className="bg-white w-full rounded-2xl mt-4 p-4">
      <div className="flex gap-4">
        <span className="font-semibold text-light-gray">
          Section {sectionNumber}
        </span>
        <button className="ms-auto" onClick={() => setIsFavorite(!isFavorite)}>
          {isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
        </button>
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
      {sectionsData.map((section, index) => (
        <Section
          key={index}
          sectionTitle={section.sectionTitle}
          totalChapters={section.totalChapters}
          totalItems={section.totalItems}
          sectionNumber={section.sectionNumber}
        >
          {section.items.map((item, itemIndex) => (
            <Item
              key={itemIndex}
              itemNumber={item.itemNumber}
              status={item.status}
              pendingCount={item.pendingCount}
            />
          ))}
        </Section>
      ))}
    </div>
  );
};

export default Chapters;
