import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({
        data: {
          shopName: "Atlas Reserve",
          logoUrl: "/logo.jpg",
          whatsapp: "(11) 99999-9999",
          instagram: "@atlasreserve",
          address: "Rua Exemplo, 123 - Centro, São Paulo",
          primaryColor: "#000000",
          secondaryColor: "#D4AF37",
          landingText: "Experiência premium de barbearia.",
        },
      });
    }
    return NextResponse.json(setting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let setting = await prisma.setting.findFirst();

    if (!setting) {
      setting = await prisma.setting.create({
        data: body,
      });
    } else {
      setting = await prisma.setting.update({
        where: { id: setting.id },
        data: body,
      });
    }

    return NextResponse.json(setting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
