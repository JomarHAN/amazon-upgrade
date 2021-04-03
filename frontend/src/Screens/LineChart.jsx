import React from "react";
import { Line } from "react-chartjs-2";

function LineChart({ title }) {
  const red = "255, 99, 132";
  const blue = "54, 162, 235";
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3, 8],
        fill: false,
        backgroundColor: `rgb(${red})`,
        borderColor: `rgba(${red}, 0.2)`,
        yAxisID: "y-axis-1",
      },
      {
        data: [1, 5, 8, 9, 4, 10, 7],
        fill: false,
        backgroundColor: `rgb(${blue})`,
        borderColor: `rgba(${blue}, 0.2)`,
        yAxisID: "y-axis-2",
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1",
        },
        {
          type: "linear",
          display: true,
          position: "right",
          id: "y-axis-2",
          gridLines: {
            drawOnArea: false,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
  };
  return (
    <div className="tableChart-dashboard">
      <h1>{title}</h1>
      <Line data={data} options={options} />
    </div>
  );
}

export default LineChart;