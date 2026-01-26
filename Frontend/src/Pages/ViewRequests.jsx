import { useEffect, useState } from "react";
import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTable } from "react-table";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Component/Footer";
import Spinner from "../Component/Spinner";
import Popup from "../Component/Popup";
import { FaArrowRight } from "react-icons/fa";

export default function ViewRequests() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const [updatestatusid, setUpdatestatusid] = useState("");
  const [activeButton, setActiveButton] = useState("pending");
  const [loading, setloading] = useState(false);
  // const [showupdatestatus, setShowupdatestatus] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userEmail");
  // console.log(userRole);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const fetchData = async () => {
    setloading(true);
    setActiveButton("pending");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ticket?status=pending`
      );
      // console.log(tickets);
      let DisplayData = response.data.filter(ticket => ticket.email === userId);

      if (userRole !== "super-admin" && userRole !== "sub-admin") {
        setTickets(DisplayData);
      } else {
        if (userRole === "sub-admin") {
          DisplayData = response.data.filter(ticket =>
            ticket.approvedBy === null && ticket.requestType === "club"
          );
          setTickets(DisplayData);
        } else {
          // userRole is super-admin
          DisplayData = response.data.filter(ticket =>
            ticket.requestType === "teacher" || ticket.approvedBy === "sub-admin"
          );
          setTickets(DisplayData);
        }
      }
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
      let DisplayData = response.data.filter(ticket => ticket.email === userId);
      console.log(response.data);

      if (userRole !== "super-admin" && userRole !== "sub-admin") {
        setTickets(DisplayData);
      } else {
        setTickets(response.data);
      }
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
      // console.log(response.data[0].email);
      let DisplayData = response.data.filter(ticket => ticket.email === userId);

      if (userRole !== "super-admin" && userRole !== "sub-admin") {
        setTickets(DisplayData);
      } else {
        if (userRole === "sub-admin") {
          DisplayData = response.data.filter(ticket =>
            ticket.approvedBy === null && ticket.requestType === "club"
          );
          setTickets(DisplayData);
        } else {
          // userRole is super-admin
          DisplayData = response.data.filter(ticket =>
            ticket.requestType === "teacher" || ticket.approvedBy === "sub-admin"
          );
          setTickets(DisplayData);
        }
      }
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
      // console.log(response.data);
      let DisplayData = response.data.filter(ticket => ticket.email === userId);

      if (userRole !== "super-admin" && userRole !== "sub-admin") {
        setTickets(DisplayData);
      } else {
        setTickets(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setloading(false);
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
        if (status === "booked") {
          toast.success("Booking Request Accepted successfully!");
        }
        else if (status === "declined") {
          toast.error("Booking Request Declined!");
        }
        else if (status === "pending") {
          toast.success("Booking Request forwarded!");
        } else {
          toast.error(status);
        }
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
    return dateString;
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
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Details",
        accessor: "details",
        Cell: ({ row }) => (
          <div
            className="flex underline cursor-pointer justify-center bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded"
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
            {userRole === "super-admin" && row.original.status === "pending" && (
              <>
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
            )}
            {userRole === "sub-admin" && row.original.status === "pending" && (
              <>
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
                <button
                  className="forward-button"
                  onClick={() => handleClick(row.original._id, "forwarded")}
                >
                  <FaArrowRight className="text-blue-500 text-2xl" />
                </button>
              </>
            )}
            {userRole !== "super-admin" && userRole !== "sub-admin" && (
              <div>{row.original.status}</div>
            )}
          </div>
        ),
      },
    ],
    [updatestatusid, userRole]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: tickets,
    });

  // Add this useEffect to handle body scroll
  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset body scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPopupOpen]);

  return (
    <>
      <div>
        {isPopupOpen && (
          <>
            {/* Add an overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closePopup}
            />
            {/* Position the popup in center */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <Popup data={selectedRowData} onClose={closePopup} />
            </div>
          </>
        )}
        <Toaster />
      </div>
      <div className="mx-8 flex gap-[10px]">
        <button
          onClick={handleBookedClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${activeButton === "booked" ? "bg-slate-800 text-white" : "bg-gray-200"
            }`}
        >
          Booked
        </button>
        <button
          onClick={handlePendingClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${activeButton === "pending"
            ? "bg-slate-800 text-white"
            : "bg-gray-200"
            }`}
        >
          Pending
        </button>
        <button
          onClick={handleDeclinedClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${activeButton === "declined"
            ? "bg-slate-800 text-white"
            : "bg-gray-200"
            }`}
        >
          Declined
        </button>
      </div>
      <div className="min-h-[80vh] mt-[20px] mx-8 overflow-x-auto flex justify-center items-start">
        <Spinner show={loading} />
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
          {!loading &&
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
                        className="py-3 px-3 text-gray-700 "
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>}
        </table>
      </div>
      <div className="">
        <Footer />
      </div>
    </>
  );
}