"use client";

import { useEffect, useState } from "react";
import WigetItem from "@/components/admin/WigetItem";
import { AdminTable } from "@/components/admin/adminTable";
import { Loader } from "@/components/loading";
import {  getProductCount } from "@/action";
import Link from "next/link";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmins] = useState([]);
  const [users, setUsers] = useState(0);
  const [orders, setOrders] = useState(0);
  const [product,setProduct]=useState(0)
  useEffect(() => {
    const getDashboardData = async () => {
      setLoading(true);

      try {
        // fetch users and admins
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.users);
        setAdmins(data.admins);
         const ProductCount = await getProductCount();
        setProduct(ProductCount.count)
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  return (
    <div>
      <section className='grid grid-cols-2 gap-6'>
        <WigetItem properties={"Product"} value={product} />
        <WigetItem properties={"Users"} value={users} />
      </section>
      <section className="mt-6">
        {loading ? (
          <div className="m-20"><Loader /></div>
        ) : admin.length > 0 ? (
          <AdminTable admins={admin} />
        ) : (
          <p>No Admin Sign</p>
        )}
      </section>
    </div>
  );
};

export default Page;
