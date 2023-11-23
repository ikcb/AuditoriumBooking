import codebase from "../assets/codebase.png";
const Footer = () => {
  return (
    <div className="w-full bg-slate-700 text-white font-semibold flex items-center  text-xl max-sm:text-[12px] mt-5 shadow-lg  justify-center h-[10vh] ">
      <div className=" "> <img src={codebase} alt="codebase" className=" h-[3.5rem] max-sm:h-[35px]"/></div>
      Developed By Codebase - IIIT Kota
    </div>
  );
};
export default Footer;
