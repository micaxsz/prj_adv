import { status, tipe } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tutorialId = body.tutorialId as number;
    const tipe = body.tipe as tipe;
    const order = body.order as number;
    const isi = body.isi as string;
    const status = body.status as status;

    const data = await prisma.detail_tutorial.create({
      data: {
        tutorial_id: tutorialId,
        tipe,
        order,
        isi,
        status,
      },
    });
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating detail tutorial:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create detail tutorial" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
