import { MdPerson } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

const LockIcon = () => <MdLock className="text-white h-5 w-5"/>
const PersonIcon = () => <MdPerson className="text-white h-5 w-5"/>
const CalenderIcon = () => <SlCalender className="text-white h-4 w-4 md:h-5"/>


export {PersonIcon, LockIcon, CalenderIcon}