import { NextResponse } from "next/server";

type Platform = "telegram" | "instagram";

type PublishRequest = {
  platform?: Platform;
  message?: string;
  imageUrl?: string;
};

function missingEnv(name: string) {
  return NextResponse.json(
    { ok: false, error: `Server is missing ${name} env variable.` },
    { status: 500 },
  );
}

export async function POST(request: Request) {
  let payload: PublishRequest;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const platform = payload.platform;
  const message = payload.message?.trim();
  const imageUrl = payload.imageUrl?.trim();

  if (!platform || (platform !== "telegram" && platform !== "instagram")) {
    return NextResponse.json(
      { ok: false, error: "Choose either telegram or instagram." },
      { status: 400 },
    );
  }

  if (!message) {
    return NextResponse.json(
      { ok: false, error: "Message cannot be empty." },
      { status: 400 },
    );
  }

  try {
    if (platform === "telegram") {
      return await publishToTelegram(message);
    }

    return await publishToInstagram({ message, imageUrl });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Unexpected error occurred.";
    return NextResponse.json({ ok: false, error: reason }, { status: 500 });
  }
}

async function publishToTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token) return missingEnv("TELEGRAM_BOT_TOKEN");
  if (!chatId) return missingEnv("TELEGRAM_CHAT_ID");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.ok) {
    const error =
      data?.description ?? "Telegram API returned an unsuccessful response.";
    return NextResponse.json({ ok: false, error }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    message: "Message posted to Telegram.",
  });
}

async function publishToInstagram({
  message,
  imageUrl,
}: {
  message: string;
  imageUrl?: string;
}) {
  const accessToken = process.env.IG_ACCESS_TOKEN;
  const businessId = process.env.IG_BUSINESS_ID;
  const defaultImageUrl = process.env.IG_DEFAULT_IMAGE_URL;

  if (!accessToken) return missingEnv("IG_ACCESS_TOKEN");
  if (!businessId) return missingEnv("IG_BUSINESS_ID");

  const resolvedImageUrl = imageUrl || defaultImageUrl;

  if (!resolvedImageUrl) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Instagram requires an image. Provide one in the form or set IG_DEFAULT_IMAGE_URL.",
      },
      { status: 400 },
    );
  }

  // Step 1: create a media container
  const createResponse = await fetch(
    `https://graph.facebook.com/v21.0/${businessId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caption: message,
        image_url: resolvedImageUrl,
        access_token: accessToken,
      }),
    },
  );

  const createData = await createResponse.json();

  if (!createResponse.ok || !createData.id) {
    const error =
      createData?.error?.message ??
      "Instagram Graph API could not create the media container.";
    return NextResponse.json({ ok: false, error }, { status: 502 });
  }

  // Step 2: publish the media container
  const publishResponse = await fetch(
    `https://graph.facebook.com/v21.0/${businessId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: createData.id,
        access_token: accessToken,
      }),
    },
  );

  const publishData = await publishResponse.json();

  if (!publishResponse.ok || !publishData.id) {
    const error =
      publishData?.error?.message ??
      "Instagram Graph API could not publish the media.";
    return NextResponse.json({ ok: false, error }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    message: "Post published to Instagram.",
  });
}
