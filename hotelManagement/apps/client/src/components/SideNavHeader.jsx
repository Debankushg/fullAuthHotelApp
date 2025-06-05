import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/Auth";
import Cookies from "js-cookie";

const SideNavHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = Cookies.get("user");
  const userData = JSON.parse(user);

  const initialName = userData?.username?.slice(0, 2)?.toUpperCase();
  const ClientName = userData?.username?.slice(0, 2)?.toUpperCase();

  const handleLogout = async () => {
    const res = await logoutUser();
    if (res.status === "success") {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-999 flex w-full h-[70px] bg-white border-b-1 border-b-[#D4DDF866] drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none px-8">
      <div className="flex flex-grow items-center justify-between px-0 py-4 shadow-2">
        <h1 className="text-2xl font-semibold text-violet-600">
          {location.pathname.split("/")[1].replace(/_/g, " ")?.toUpperCase()}
        </h1>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <div className="flex gap-4">
            <Link className="flex items-center gap-4" to="#">
              {/* {profileData?.data?.upload_photo ? (
                <img
                  className="w-[38px] h-[38px] rounded-full"
                  src={profileData?.data?.upload_photo}
                  alt="User"
                />
              ) : ( */}
              <span className="h-[46px] w-[46px] rounded-full border border-[#3E3DFF] p-1 flex items-center justify-center">
                <span className="w-[38px] h-[38px] rounded-full font-bold text-white flex items-center justify-center bg-gradient-to-r from-indigo-500 to-pink-400  text-lg">
                  {ClientName ? ClientName : initialName}
                </span>
              </span>
              {/* )} */}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SideNavHeader;
