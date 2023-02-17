//calender
document.addEventListener("DOMContentLoaded", function () {
  let calendarEl = document.getElementById("calendar");
  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    dateClick: async function (info) {
      //this function is to fetch to backend for getting sum of price
      async function getSalesRecord() {
        let res = await fetch("/getSalesRecord", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ info_dateStr: info.dateStr }),
        });

        let salesRecord = await res.json();

        return salesRecord;
      }

      //this function is to fetch to backend for getting booked hotels
      async function getBookedHotels() {
        let res = await fetch("/getBookedHotels", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ info_dateStr: info.dateStr }),
        });

        let bookedHotels = await res.json();
        console.log(bookedHotels);

        return bookedHotels;
      }
      //getting sum of price though function
      let finalSalesRecord = await getSalesRecord();
      //getting all the booked hotels though function
      let finalBookedHotels = await getBookedHotels();
      console.log(finalBookedHotels);
      let str = ``;
      for (let finalBookedHotel of finalBookedHotels) {
        str += `${finalBookedHotel.hotel_name}: HKD ${finalBookedHotel.sum}; `;
      }

      //write data on the admin info board using innerHTML
      let showBoard = document.querySelector(".box");
      showBoard.innerHTML = `
      <div>1. Today total profits: HKD ${finalSalesRecord[0].sum}</div> 
      <div>2. Booked Hotels and profits for each: ${str}</div>
      `;

      info.dayEl.style.backgroundColor = "wheat";
    },
  });
  calendar.render();
});

//chart
const ctx = document.getElementById("myChart");

async function getLineData() {
  let res = await fetch("/getTotalMonthProfit");
  let result = await res.json();
  console.log(result);
  let monthObject = {};
  for (let i = 1; i < 13; i++) {

    let ind = result.findIndex(
      (v) => new Date(v.production_to_month).getMonth() + 1 === i
    );

    monthObject[i] = ind >= 0 ? +result[ind].money_count : 0;
  }

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "2022 total profits per months",
        data: [
          monthObject[1],
          monthObject[2],
          monthObject[3],
          monthObject[4],
          monthObject[5],
          monthObject[6],
          monthObject[7],
          monthObject[8],
          monthObject[9],
          monthObject[10],
          monthObject[11],
          monthObject[12],
        ],

        backgroundColor: "red",
      },
    ],
  };

  new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Chart.js Line Chart - Cubic interpolation mode",
        },
      },
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Value",
          },
          suggestedMin: 0,
          suggestedMax: 200,
        },
      },
    },
  });
}

getLineData();

function addMonths(numOfMonths, date = new Date()) {
  date.setMonth(date.getMonth() + numOfMonths);

  return date;
}

// 👇️ Add months to another date
const date1 = new Date("2022-01-01");
console.log(addMonths(0, date1)); // 👉️ Tue May 24 2022
