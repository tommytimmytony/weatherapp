import { object } from "yup";
import { useEffect, useState } from "react";
import { customGetDate } from "../functions.js";
export default function NextDayForecast({
  nextForecast,
  fullDate1,
  fullDate2,
}) {

  return (
    <>
      {nextForecast ? (
        <>
          <li className="flex justify-between">
            <span>{`${customGetDate("date", fullDate1)} ${customGetDate(
              "month name",
              fullDate1
            ).slice(0, 3)}`}</span>
            <span>{`${customGetDate("day", fullDate1).slice(0, 3)}`}</span>
            <span>{`${parseInt(
              nextForecast[fullDate1.slice(0, 10)].day.mintemp_f
            )}°C / ${parseInt(
              nextForecast[fullDate1.slice(0, 10)].day.maxtemp_f
            )}°C`}</span>
          </li>
          <li className="flex justify-between">
            <span>{`${customGetDate("date", fullDate2)} ${customGetDate(
              "month name",
              fullDate2
            ).slice(0, 3)}`}</span>
            <span>{`${customGetDate("day", fullDate2).slice(0, 3)}`}</span>
            <span>{`${parseInt(
              nextForecast[fullDate2.slice(0,10)].day.mintemp_f
            )}°C / ${parseInt(
              nextForecast[fullDate2.slice(0, 10)].day.maxtemp_f
            )}°C`}</span>
          </li>
        </>
      ) : null}
    </>
  );
}
