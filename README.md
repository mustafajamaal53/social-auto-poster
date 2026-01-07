# Social Media Auto-Poster

A Next.js web application to automatically post content to Telegram or Instagram.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd social-auto-poster
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp env.example .env.local
```

4. Set up API tokens (see below)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Setting Up Telegram API Tokens

### Get Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the bot token provided by BotFather

### Get Chat ID

1. Start a conversation with your bot (search for your bot's username and click "Start")
2. Send any message to your bot (e.g., "Hello")
3. Open this URL in your browser (replace `YOUR_BOT_TOKEN` with your actual token):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Find the `"id"` number inside the `"chat"` object in the JSON response
5. Copy that number - that's your Chat ID

### Add to .env.local

Open `.env.local` (created in step 3) and add your credentials:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## Testing

1. Make sure your `.env.local` has the Telegram credentials
2. Start the dev server: `npm run dev`
3. Go to `http://localhost:3000`
4. Type a message, select "Telegram", and click "Publish"
5. Check your Telegram chat - you should see your message!

## Instagram Setup (Optional)

If you want to test Instagram posting, you'll need:
- Instagram Business or Creator account
- Facebook Page connected to Instagram
- Instagram Graph API access token and Business Account ID

Add these to `.env.local`:
```env
IG_ACCESS_TOKEN=your_instagram_access_token
IG_BUSINESS_ID=your_instagram_business_account_id
IG_DEFAULT_IMAGE_URL=https://example.com/image.jpg
```

## Notes

- All API credentials are stored in `.env.local` (never hardcoded)
- Credentials are only read server-side and never exposed to the browser
- The app handles errors and displays helpful messages if something goes wrong
