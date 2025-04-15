import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IUserDetailsProps } from "@/types/components/profile";
import React from "react";

const UserDetails: React.FC<IUserDetailsProps> = ({ user }) => {
  return (
    <div className="flex items-start flex-wrap-reverse">
      <div className="flex gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user?.photoURL} alt="Profile Picture" />
          <AvatarFallback className="bg-primary text-primary-content">
            {user?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-xl font-semibold">{user?.name}</h4>
          <h4 className="">@{user?.userName}</h4>
          <p className=" mt-2">{user?.email}</p>
        </div>
      </div>
      <Badge className="ml-auto mb-auto" color="green">
        Free
      </Badge>
    </div>
  );
};

export default UserDetails;
