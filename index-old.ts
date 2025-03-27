import {
  getDailyChatsData,
  processChatStatistics,
} from "./process-chat-statistics";

(async () => {
  // Get data
  const dailyChatsData = await getDailyChatsData();

  // Please add the dates here to test function
  // Enter and then save file
  /*
    data: {
      dailyChatsData,
      startDate: new Date("2019-04-01") || undefined,
      endDate: new Date("2019-04-30") || undefined,
    }
  */
  const result = await processChatStatistics({
    dailyChatsData,
    startDate: new Date("2019-04-01"),
    endDate: new Date("2019-04-30"),
  });
  console.log(result);
})();
