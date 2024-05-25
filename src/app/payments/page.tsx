'use client'
import Image from "next/image";
import payments from "./payments.module.css";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [allPayments, setAllPayments] = useState([]);

  useEffect(() => {
    axios.post('http://192.168.10.122:2345/getAllPayments', {
      passwordapi: 'myapipassword'
    })
    .then((response) => {
      setAllPayments(response.data.send_data);
    })
    .catch((error) => {
      console.error('Error fetching payments:', error);
    });
  }, []);

  return (
    <div>
      <h1>All Payments</h1>
      <br />
      
      {allPayments.map((payment) => (
        <div key={payment.id} className={`${payments.card} ${payment.type === 'positive' ? payments.positive : payments.negative}`}>
          <p>Date: {payment.date}</p>
          <p>Payment: {payment.payment}$</p>

        </div>
      ))}
    </div>
  );
}
