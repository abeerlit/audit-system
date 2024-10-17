import React, { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isItemsVisible, setIsItemsVisible] = useState(false);

  return (
    <div className="bg-white w-full rounded-2xl mb-4">
      <div className="flex justify-between items-center pt-4 px-4">
        <div className="flex justify-between w-full">
          <span className="text-[1rem] font-medium text-light-gray leading-[30px]">
            Section {sectionNumber}
          </span>
          <button onClick={() => setIsFavorite(!isFavorite)}>
            {isFavorite ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.7526 0.836426C11.9133 0.836426 11.1112 1.02882 10.3685 1.40831C9.86292 1.66658 9.39852 2.00973 9 2.41686C8.60148 2.00973 8.13708 1.66658 7.63152 1.40831C6.8888 1.02882 6.08667 0.836426 5.24739 0.836426C2.35399 0.836426 0 3.19042 0 6.08385C0 8.13322 1.08234 10.3098 3.21692 12.5532C4.99918 14.4264 7.18122 15.9878 8.69786 16.9679L9 17.1631L9.30214 16.9679C10.8188 15.9879 13.0008 14.4264 14.7831 12.5532C16.9177 10.3098 18 8.13322 18 6.08385C18 3.19042 15.646 0.836426 12.7526 0.836426Z"
                  fill="#2B3674"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5461 1.55655C15.6035 0.614007 14.3557 0.0988503 13.0239 0.0988503C11.6922 0.0988503 10.4405 0.617823 9.49799 1.56037L9.00573 2.05263L8.50583 1.55274C7.56329 0.610191 6.30783 0.0874023 4.97605 0.0874023C3.64809 0.0874023 2.39645 0.606375 1.45772 1.54511C0.515178 2.48765 -0.00379508 3.73929 2.08952e-05 5.07107C2.08952e-05 6.40284 0.52281 7.65067 1.46536 8.59321L8.63176 15.7596C8.73098 15.8588 8.86453 15.9123 8.99428 15.9123C9.12402 15.9123 9.25758 15.8626 9.3568 15.7634L16.5385 8.60848C17.481 7.66593 18 6.41429 18 5.08252C18.0038 3.75074 17.4886 2.4991 16.5461 1.55655ZM15.8134 7.87963L8.99428 14.6721L2.19039 7.86818C1.44246 7.12025 1.03033 6.12809 1.03033 5.07107C1.03033 4.01404 1.43864 3.02189 2.18658 2.27777C2.93069 1.53366 3.92284 1.12153 4.97605 1.12153C6.03308 1.12153 7.02905 1.53366 7.77698 2.28159L8.63939 3.144C8.84164 3.34625 9.166 3.34625 9.36824 3.144L10.223 2.28922C10.971 1.54129 11.9669 1.12916 13.0201 1.12916C14.0733 1.12916 15.0655 1.54129 15.8134 2.2854C16.5614 3.03334 16.9697 4.02549 16.9697 5.08252C16.9735 6.13954 16.5614 7.1317 15.8134 7.87963Z"
                  fill="#2B3674"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div
        className="flex w-full justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center w-full">
          <button>
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={!isOpen ? "rotate-180" : "rotate-0"}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.0002 7C11.198 6.99996 11.3913 6.94129 11.5557 6.8314C11.7201 6.72152 11.8482 6.56535 11.9239 6.38265C11.9996 6.19995 12.0194 5.99892 11.9808 5.80497C11.9422 5.61102 11.847 5.43285 11.7072 5.293L6.70721 0.293C6.51969 0.105529 6.26538 0.000213122 6.00021 0.000213099C5.73505 0.000213075 5.48074 0.105529 5.29321 0.293L0.293212 5.293C0.153402 5.43285 0.0581971 5.61101 0.0196296 5.80497C-0.018938 5.99892 0.000865053 6.19995 0.0765353 6.38265C0.152206 6.56535 0.280345 6.72152 0.444755 6.8314C0.609164 6.94129 0.802463 6.99996 1.00021 7L11.0002 7Z"
                fill="#2B3674"
              />
            </svg>
          </button>
          <h3 className="text-[24px] text-nowrap leading-[20px] font-black text-auth-purple ml-2">
            {sectionTitle}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-nowrap text-auth-purple font-bold bg-[#E7E7E7] px-3 py-2 rounded-full">
            Chapters: {totalChapters}
          </span>
          <span className="text-sm text-nowrap text-auth-purple font-bold bg-[#E7E7E7] px-3 py-2 rounded-full">
            Total Items: {totalItems}
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="pb-4">
          <div className=" mx-4 border rounded-lg">
            <ChapterHeader
              chapterNumber={sectionNumber}
              title={sectionTitle}
              isItemsVisible={isItemsVisible}
              onClick={() => setIsItemsVisible(!isItemsVisible)}
            />
            {isItemsVisible && children}
          </div>
        </div>
      )}
    </div>
  );
};

const Item: React.FC<ItemProps> = ({ itemNumber, status, pendingCount }) => (
  <div className="flex justify-between items-center  border-t">
    <div className="flex p-3 items-center">
      <div className="focus:outline-none"></div>
      <div className="flex items-center ml-5">
        <span className="bg-[#777777] text-white text-nowrap rounded-full py-1 px-3 flex items-center justify-center mr-2 text-[12px] font-bold leading-[20px]">
          {itemNumber}
        </span>
        <span className="text-nowrap">{status}</span>
      </div>
    </div>
    <span className="bg-[#FFEAB0] me-2 text-nowrap border-2 border-[#B4984C] text-[#B4984C] rounded-full px-3 py-2 text-sm font-bold">
      Pending Items: {pendingCount}
    </span>
  </div>
);

const ChapterHeader: React.FC<{
  chapterNumber: string;
  title: string;
  onClick: () => void;
  isItemsVisible: boolean;
}> = ({ chapterNumber, title, onClick, isItemsVisible }) => (
  <div className="flex items-center p-2 cursor-pointer" onClick={onClick}>
    <button>
      <svg
        width="12"
        height="7"
        viewBox="0 0 12 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={!isItemsVisible ? "rotate-180" : "rotate-0"}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.0002 7C11.198 6.99996 11.3913 6.94129 11.5557 6.8314C11.7201 6.72152 11.8482 6.56535 11.9239 6.38265C11.9996 6.19995 12.0194 5.99892 11.9808 5.80497C11.9422 5.61102 11.847 5.43285 11.7072 5.293L6.70721 0.293C6.51969 0.105529 6.26538 0.000213122 6.00021 0.000213099C5.73505 0.000213075 5.48074 0.105529 5.29321 0.293L0.293212 5.293C0.153402 5.43285 0.0581971 5.61101 0.0196296 5.80497C-0.018938 5.99892 0.000865053 6.19995 0.0765353 6.38265C0.152206 6.56535 0.280345 6.72152 0.444755 6.8314C0.609164 6.94129 0.802463 6.99996 1.00021 7L11.0002 7Z"
          fill="#2B3674"
        />
      </svg>
    </button>
    <div className="flex items-center ml-5">
      <span className="bg-auth-purple text-nowrap text-white rounded-full py-1 px-3 flex items-center justify-center mr-4 text-[12px] font-bold leading-[20px]">
        {chapterNumber}
      </span>
      <span className="text-[20px] text-nowrap leading-[20px] font-semibold text-auth-purple">
        {title}
      </span>
    </div>
  </div>
);

const Chapters: React.FC = () => {
  return (
    <div className=" min-w-fit">
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
