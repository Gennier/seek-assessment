# Chat Statistics Processor

This application processes daily chat statistics from multiple websites, allowing you to filter data by date ranges and calculate total chats and missed chats per website.

## Features

- Fetch daily chat statistics from a remote API
- Filter chat data by date range
- Calculate total chats and missed chats per website
- Error handling for invalid date ranges

## Prerequisites

- Node.js installed on your system
- TypeScript installed (`npm install -g typescript`)

## Installation

1. Clone this repository
2. Install dependencies:

```bash
// Run this command to install dependencies

pnpm install
```

## Running the Application

1. Run the TypeScript file:

```bash
pnpm start
```

## Testing Different Date Ranges

To test the application with different date ranges:

1. Open `index.ts`
2. Locate the following code block at the bottom of the file:

```typescript
const result = await processChatStatistics({
  dailyChatsData,
  startDate: new Date("2019-04-01"),
  endDate: new Date("2019-04-30"),
});
```

3. Modify the `startDate` and `endDate` parameters to your desired date range
4. Save the file
5. Recompile and run the application using the commands mentioned above

### Date Format

Dates should be provided in the "YYYY-MM-DD" format. For example:

- `new Date("2019-04-01")` for April 1st, 2019
- `new Date("2019-04-30")` for April 30th, 2019

### Notes

- If you don't want to filter by date, you can remove both `startDate` and `endDate` parameters
- The `startDate` must be less than or equal to the `endDate`
- You cannot specify an `endDate` without a `startDate`
- `process-chat-statistics.ts` is where all the logic is implemented
- `index.ts` is where the application is run
- `tests/index.test.ts` is where the tests are implemented
