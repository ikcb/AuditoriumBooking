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

export default function ViewRequests() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const [activeButton, setActiveButton] = useState("pending");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ticket?status=pending`
      );
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleBookedClick = () => {
    setActiveButton("booked");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/ticket?status=booked`
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  };

  const handlePendingClick = () => {
    setActiveButton("pending");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/ticket?status=pending`
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  };

  const handleDeclinedClick = () => {
    setActiveButton("declined");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/ticket?status=declined`
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
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
        } else {
          toast.error("Booking Request Declined!");
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
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ cell }) => reverseDateFormat(cell.value.slice(0, 10)),
      },
      {
        Header: "Email",
        accessor: "email",
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
        Header: "Event Description",
        accessor: "eventdescription",
      },
      {
        Header: "Mobile No",
        accessor: "mobileno",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            {row.original.status === "pending" && (
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
            )}
          </div>
        ),
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: tickets,
    });

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="mx-8 flex gap-1 ">
        <button
          onClick={handleBookedClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${
            activeButton == "booked" ? "bg-slate-800 text-white" : "bg-gray-200"
          }`}
        >
          Booked
        </button>
        <button
          onClick={handlePendingClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${
            activeButton == "pending"
              ? "bg-slate-800 text-white"
              : "bg-gray-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={handleDeclinedClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${
            activeButton == "declined"
              ? "bg-slate-800 text-white"
              : "bg-gray-200"
          }`}
        >
          Declined
        </button>
      </div>
      <div className="min-h-[80vh]  mx-8 overflow-x-auto flex  justify-center items-start">
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
      <div className="">
        <Footer />
      </div>
    </>
  );
}
