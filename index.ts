import { ChatStatisticsProcessor } from "./modules/chat/chat.service";
import { TawkChatDataProvider } from "./modules/data-providers/chat";

(async () => {
  // Get data
  const dataProvider = new TawkChatDataProvider();

  const chatStatisticsProcessor = new ChatStatisticsProcessor(dataProvider);
  // Please add the dates here to test function
  // Enter and then save file
  /*
    data: {
      dailyChatsData,
      startDate: new Date("2019-04-01") || undefined,
      endDate: new Date("2019-04-30") || undefined,
    }
  */
  const result = await chatStatisticsProcessor.processChatStatistics({
    startDate: new Date("2019-04-01"),
    endDate: new Date("2019-04-30"),
  });
  console.log(result);
})();
