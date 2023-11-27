/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTable } from "react-table";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Component/Footer";
import Spinner from "../Component/Spinner";
import Popup from "../Component/Popup";
import statusimg from "../assets/img_group.svg";
import { Bars } from "react-loader-spinner";

export default function ViewRequests() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const [updatestatusid, setUpdatestatusid] = useState("");
  const [activeButton, setActiveButton] = useState("pending");
  const [loading, setloading] = useState(false);
  const [showupdatestatus, setShowupdatestatus] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const [isLoading, setIsLoading] = useState(true);

  setTimeout(() => {
    setIsLoading(false);
  }, 3000);
  const fetchData = async () => {
    setloading(true);
    setActiveButton("pending");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ticket?status=pending`
      );
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setloading(false);
  };
  const handleBookedClick = async () => {
    setloading(true);
    setActiveButton("booked");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ticket?status=booked`
      );
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setloading(false);
  };

  const handlePendingClick = async () => {
    setloading(true);
    setActiveButton("pending");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ticket?status=pending`
      );
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setloading(false);
  };

  const handleDeclinedClick = async () => {
    setloading(true);
    setActiveButton("declined");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ticket?status=declined`
      );
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setloading(false);
  };

  const UpdateStatus = async (id, status) => {
    try {
      const authtoken = localStorage.getItem("authtoken");
      if (!authtoken) {
        toast.error("Please login to continue!");
        return;
      }

      axios
        .put(`${import.meta.env.VITE_BASE_URL}/updateticket/${id}`, {
          status: status,
          token: authtoken,
        })
        .then((response) => {
          toast.success("Status Updated Successfully!");

          if (activeButton === "pending")
            handlePendingClick();
          else if (activeButton === "booked")
            handleBookedClick();
          else
            handleDeclinedClick();
          console.log(response);
          toast.success(response.data);
          fetchData();
          setUpdatestatusid("");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          fetchData();
          setUpdatestatusid("");
        });
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const handleClick = async (id, status) => {
    try {
      const authtoken = localStorage.getItem("authtoken");
      if (!authtoken) {
        toast.error("Please login to continue!");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/updateticket/${id}`,
        { status: status, token: authtoken }
      );
      if (response) {
      
          toast.error(response.data);
      
      }
      await fetchData();
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  function reverseDateFormat(dateString) {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString; // Return the original string if it's not in the expected format
  }
  const columns = React.useMemo(
    () => [
      {
        Header: "S.No.",
        accessor: "id",
        Cell: ({ row }) => {
          return <div>{row.index + 1}</div>;
        },
      },
      {
        Header: "Club Name",
        accessor: "clubname",
      },

      // {
      //   Header: "Email",
      //   accessor: "email",
      // },
      {
        Header: "Start Time",
        accessor: "startTime",
      },
      {
        Header: "End Time",
        accessor: "endTime",
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ cell }) => reverseDateFormat(cell.value.slice(0, 10)),
      },
      // {
      //   Header: "Event Description",
      //   accessor: "eventdescription",
      // },
      // {
      //   Header: "Mobile No",
      //   accessor: "mobileno",
      // },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: " Details",
        accessor: "details",
        Cell: ({ row }) => (
          <div
            className="flex  underline cursor-pointer justify-center bg-blue-500 hover:bg-blue-700 text-white  py-1 px-1 rounded"
            onClick={() => {
              setSelectedRowData(row.original);
              openPopup();
            }}
          >
            See more
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <div className="flex relative gap-4">
            {row.original.status === "pending" ? (
              <>
                {" "}
                <button
                  className="accept-button"
                  onClick={() => handleClick(row.original._id, "booked")}
                >
                  <FaCheckCircle className="text-green-500 text-2xl" />
                </button>
                <button
                  className="decline-button"
                  onClick={() => handleClick(row.original._id, "declined")}
                >
                  <FaTimesCircle className="text-red-500 text-2xl" />
                </button>
              </>
            ) : (
              <>
                <img
                  className="ml-[35px] my-px cursor-pointer"
                  src={statusimg}
                  onClick={() => {
                    if (updatestatusid === row.original._id) {
                      setUpdatestatusid("");
                    } else {
                      setUpdatestatusid(row.original._id);
                    }
                  }}
                  alt="Group"
                />
                {updatestatusid === row.original._id && (
                  <div className="updatestatus absolute w-auto top-0 left-[-130px] z-[10] px-2 update_status mr-[10px]">
                    <div className="w-auto h-auto  border-[1px] border-[#EAEAEA] bg-[#F2F5F8]  rounded-[12px] ">
                      <div className="w-full h-full flex flex-col gap-0 justify-between cursor-pointer font-[Inter] text-[12px] font-[400]">
                        <div className="pt-[5px] pb-[10px] flex items-center w-[144px] justify-center text-[12px] font-bold ">
                          UPDATE STATUS
                        </div>
                        {activeButton != "booked" &&
                          <div
                            onClick={() =>
                              UpdateStatus(row.original._id, "booked")
                            }
                            className="h-auto flex items-center px-[15px] py-[7px] bg-[#FFF]"
                          >
                            Booked
                          </div>
                        }
                        {activeButton != "pending" &&
                          <div
                            onClick={() =>
                              UpdateStatus(row.original._id, "pending")
                            }
                            className="h-auto flex items-center px-[15px] py-[7px] bg-[#FFF]"
                          >
                            Pending
                          </div>}
                        {activeButton != "declined" &&
                          <div
                            onClick={() =>
                              UpdateStatus(row.original._id, "declined")
                            }
                            className="h-auto flex items-center px-[15px] py-[7px] bg-[#FFF]"
                          >
                            Decline
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ),
      },
      
    ],
    [updatestatusid]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: tickets,
    });

  return (
    <>
      <div>
      {isPopupOpen && <Popup data={selectedRowData} onClose={closePopup} />}
        <Toaster />
      </div>
      <div className="mx-8 flex gap-[10px]">
        <button
          onClick={handleBookedClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${activeButton == "booked" ? "bg-slate-800 text-white" : "bg-gray-200"
            }`}
        >
          Booked
        </button>
        <button
          onClick={handlePendingClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${activeButton == "pending"
            ? "bg-slate-800 text-white"
            : "bg-gray-200"
            }`}
        >
          Pending
        </button>
        <button
          onClick={handleDeclinedClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${activeButton == "declined"
            ? "bg-slate-800 text-white"
            : "bg-gray-200"
            }`}
        >
          Declined
        </button>
      </div>
      {isLoading ? (
        <div
          style={{
            width: "100px",
            margin: "auto",
          }}
        >
          <Bars
            height="90"
            width="90"
            color="#5c85f8"
            ariaLabel="bars-loading"
            wrapperStyle={{ marginTop: "200px", marginBottom: "350px" }}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div className="min-h-[80vh] mt-[20px]  mx-8 overflow-x-auto flex  justify-center items-start">
          <table
            {...getTableProps()}
            className="w-[1500px] divide-y divide-gray-200 bg-white shadow-md"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-gray-100"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="py-3 px-6 text-left font-semibold text-gray-700"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="py-3 px-3 text-gray-700"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="">
        <Footer />
      </div>
    </>
  );
}
