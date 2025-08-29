import { MdPerson } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

const LockIcon = () => <MdLock className="text-gray-950 h-5 w-5"/>
const PersonIcon = () => <MdPerson className="text-gray-950 h-5 w-5"/>
const CalenderIcon = () => <SlCalender className=" h-4 w-4 md:h-5 text-gray-950" />


export {PersonIcon, LockIcon, CalenderIcon}