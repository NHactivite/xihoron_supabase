"use client";

import { useEffect, useState } from "react";
import WigetItem from "@/components/admin/WigetItem";

const Page = () => {
  const properties = ["Product", "Users", "transactions", "Orders"];
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      console.log("user list", data);
      setUsers(data.users);
    };

    getUsers();
  }, []); // ✅ empty dependency = runs only once

  return (
    <div>
      <section>
        <WigetItem properties={properties} users={users}/>
        {/* You can also pass users to props here */}
      </section>
    </div>
  );
};

export default Page;
