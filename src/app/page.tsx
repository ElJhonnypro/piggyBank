'use client'
import Image from "next/image";
import homestyle from "./home.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [total, setTotal] = useState(0);
  const [lastPayment, setLastPayment] = useState(0);
  const [lastPaymentDate, setLastPaymentDate] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [Payment, setPayment] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>('');

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    let minute = now.getMinutes();

    if(minute <= 9){
      minute = `0${String(minute)}`
    }
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;
    setCurrentDate(formattedDate);
  };
  const getTotalFunc = () => {
    axios
      .post("http://192.168.10.122:2345/getTotal", {
        passwordapi: "myapipassword",
      })
      .then((response) => {
        const { send_data } = response.data;
        setTotal(send_data);
      })
      .catch((error) => {
        console.error("Error fetching total:", error);
        setTotal(0);
      });
    }

    const getLastPayment = () => {
    axios
      .post("http://192.168.10.122:2345/lastPayment", {
        passwordapi: "myapipassword",
      })
      .then((response) => {
        const { send_data } = response.data;
        setLastPayment(send_data.lastPayment);
        setLastPaymentDate(send_data.lastPaymentDate);
      })
      .catch((error) => {
        console.error("Error fetching total:", error);
        setLastPayment(0);
      });
  }
  const handleCreatePayment = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const createPayment = () => {
    axios.post('http://192.168.10.122:2345/createPayment', {
      passwordapi: "myapipassword",
      payment: Payment,
      date: currentDate
    }).then((response) => {
      handleCreatePayment()
    })
    .catch((error) => {
      console.error("Error creating the payment:", error);

    });
  }

  useEffect(() => {
    getCurrentDate()
    getTotalFunc()
    getLastPayment()
  }, )

  return (
    <div>
      <br />
      <h3 >Total: <span className={total <= 0 ? 'negative': 'positive'}>{total}$</span></h3>
      <h3>Ultimo pago: <span className={lastPayment <= 0 ? 'negative' : 'positive'}>{lastPayment}$</span></h3>
      <h3>Fecha del ultimo pago: {lastPaymentDate}</h3>

      <button className={homestyle.botonmenu} onClick={handleCreatePayment}>Create Payment</button>

      {isMenuOpen && (
        <div className={homestyle.menu}>

          <button onClick={() => {handleCreatePayment()}}
           className={homestyle.Xbutton}>X</button>
          <h1>Create Payment Menu v0.3!</h1>
          <br />
          <input
            type="number"
            onChange={(event) => {
              setPayment(Number(event.target.value));
            }}
          />
          <button className={homestyle.botonmenu} onClick={createPayment}>Submit the payment</button>
        </div>
      )}
    </div>
  );
}