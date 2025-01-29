import React, { useState } from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import LinearProgress from "@mui/material/LinearProgress";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getAnalytics } from "../apis/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import { Button } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const { videoId } = useParams();
  const navigator = useNavigate();
  if (!videoId) return <div>No video selected</div>;

  const { data, isLoading, error } = useQuery({
    queryKey: ["allAnalytics", videoId],
    queryFn: () => getAnalytics(videoId),
  });

  if (isLoading) return <Loading />;
  if (error)
    return <div>Error: {error?.message || "Something went wrong"}</div>;

  // console.log("data->", data);

  const months = data?.monthsInRange || [];
  const commentCounts = months.map(
    (month) => data?.monthlyDistribution?.[month]?.total || 0
  );

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Total Comments",
        data: commentCounts,
        backgroundColor: "#e8c3fa",
        borderColor: "#9017cc",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: "Months" } },
      y: { title: { display: true, text: "Number of Comments" } },
    },
  };

  return (
    <div className="flex flex-col mx-5 justify-center items-center">
      <h1 className="text-2xl m-6 font-semibold w-full flex justify-center items-center">
        Analysis Result
      </h1>
      <div className="w-11/12 h-80 flex items-center">
        <div className="w-1/2 h-full flex justify-center items-center pl-20 border-2 border-slate-800">
          <div className="w-full h-50">
            <h1 className="text-xl font-semibold">Sentiment Analysis</h1>
            {["agree", "disagree", "neutral"].map((e) => (
              <div key={e} className="my-4">
                <div className="flex w-5/6 justify-between items-center">
                  <h1 className="capitalize">{e}</h1>
                  {(
                    ((data?.sentimentCounts?.[e] || 0) /
                      (data?.sentimentCounts?.totalComments || 1)) *
                    100
                  ).toFixed(2)}
                  %
                </div>
                <LinearProgress
                  className="w-5/6 rounded-2xl my-2"
                  variant="determinate"
                  value={
                    ((data?.sentimentCounts?.[e] || 0) /
                      (data?.sentimentCounts?.totalComments || 1)) *
                    100
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2 flex flex-col justify-center items-center border-2 border-slate-700 h-full">
          <div className="w-11/12 h-50">
            <h1 className="text-xl mx-3 mb-3 font-semibold">Summary</h1>
            <h1 className="text-2xl mx-3 font-bold mb-3">
              Total Comments : {data?.sentimentCounts?.totalComments}
            </h1>
            <div className="flex w-10/12 mx-3 my-4 gap-3">
              {["agree", "disagree", "neutral"].map((e) => (
                <div key={e} className="w-1/3 flex flex-col items-center">
                  <h2 className="capitalize text-lg text-medium text-slate-400">
                    {e}
                  </h2>
                  <p className="capitalize text-lg text-medium text-slate-400 mt-4">
                    {data?.sentimentCounts?.[e] || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-11/12 h-[400px] mt-6 p-4 border-2 border-slate-800 rounded-lg">
        <h2 className="text-xl font-medium mb-3">Comments Over Time</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <Button
        sx={{ margin: "3vmax" }}
        variant="outlined"
        onClick={() => {
          navigator("/");
        }}
      >
        Back to input
      </Button>
    </div>
  );
}

export default Analytics;
