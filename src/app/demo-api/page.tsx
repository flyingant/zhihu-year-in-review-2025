"use client";

import request from "@/lib/request";
import { useState } from "react";

export default function DemoNoAuth() {
  const [response, setResponse] = useState<unknown>(null);

  const callApiTest = async (url: string) => {
    try {
      const response = await request({
        url,
        method: "get",
      });
      setResponse(response);
      console.log("response", response);
    } catch (error) {
      console.log("error: ", error);
      setResponse(error);
    }
  };

  return (
    <div className="ml-4 mt-4">
      <h1 className="text-center text-[16px] mb-4">Call API Test</h1>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <button
            className="bg-blue-500 w-max hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={() => callApiTest("/campaigns/user/address")}
          >
            获取「刘看山送礼」地址信息
          </button>
          <button
            className="bg-blue-500 w-max hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={() => callApiTest("/campaigns/user/1974495708519367443")}
          >
            获取积分任务信息
          </button>
        </div>
        <div className="flex-1">{response ? JSON.stringify(response) : ""}</div>
      </div>
    </div>
  );
}
