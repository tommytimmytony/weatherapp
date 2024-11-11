
export default function NextDayForecast({nextForecast}) {


 return (
   <>
     {nextForecast ? (
       <>
         <li className="flex justify-between">
           <span>{`${nextForecast.day1.date} ${nextForecast.day1.month}`}</span>
           <span>{`${nextForecast.day1.day}`}</span>
           <span>{`${nextForecast.day1.low_temp}°C / ${nextForecast.day1.high_temp}°C`}</span>
         </li>
         <li className="flex justify-between">
           <span>{`${nextForecast.day2.date} ${nextForecast.day2.month}`}</span>
           <span>{`${nextForecast.day2.day}`}</span>
           <span>{`${nextForecast.day2.low_temp}°C / ${nextForecast.day2.high_temp}°C`}</span>
         </li>
       </>
     ) : null}
   </>
 );
}
