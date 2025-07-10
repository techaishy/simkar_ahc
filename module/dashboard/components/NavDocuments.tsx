// "use client";

// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/module/dashboard/components/Sidebar";

// interface NavDocumentsProps {
//   items: {
//     name: string;
//     url: string;
//     icon: React.ElementType;
//   }[];
// }

// export function NavDocuments({ items }: NavDocumentsProps) {
//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel>Documents</SidebarGroupLabel>
//       <SidebarGroupContent>
//         <SidebarMenu>
//           {items.map((item, i) => (
//             <SidebarMenuItem key={i}>
//               <SidebarMenuButton asChild>
//                 <a href={item.url}>
//                   <item.icon />
//                   <span>{item.name}</span>
//                 </a>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           ))}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   );
// }
