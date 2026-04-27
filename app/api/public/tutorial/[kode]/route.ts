import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { kode: string } },
) {
  try {
    const kode = (await params).kode;

    const data = await prisma.tutorial.findMany({
      include: {
        detail_tutorial: true,
      },
      where: {
        kode_matkul: kode,
      },
    });
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;

    data.map((item) => {
      item.url_presentation = `${base_url}/presentation/${item.url_presentation}`;
      item.url_finished = `${base_url}/finished/${item.url_finished}`;
    });
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
