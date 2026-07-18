import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo de imagem enviado" },
        { status: 400 }
      );
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error("Erro no upload Vercel Blob:", error);
    return NextResponse.json(
      { error: error.message || "Falha ao realizar o upload" },
      { status: 500 }
    );
  }
}
