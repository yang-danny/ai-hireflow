
import {  useEffect, useState } from "react";

export function Welcome() {
  const [message, setMessage] = useState<string>('');
  useEffect(() => {
  fetch('http://127.0.0.1:3000/api')
    .then(response => response.json())
    .then(data => setMessage(data.message));
  },[])
 console.log("message", message);
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <p>{message}</p>
    </main>
  );
}


