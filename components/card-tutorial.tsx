import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function CardTutorial({
  id,
  judul,
  foto,
  kode_matkul,
  matkul,
}: {
  id: number;
  judul: string;
  foto: string;
  kode_matkul: string;
  matkul: string;
}) {
  const router = useRouter();
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 bg-[#0f1624]">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={foto}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge className="bg-[#00ff9d]/10 border border-[#00ff9d] text-[#00ff9d] rounded-full px-2 py-1 text-xs">
            {kode_matkul}
          </Badge>
        </CardAction>
        <CardTitle>{judul}</CardTitle>
        <CardDescription>
          Tutorial pertemuan minggu ke-1 mata kuliah {matkul}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          onClick={() => {
            router.push(`/detail-tutorial/${id}`);
          }}
          className="w-full bg-blue-700 hover:bg-blue-600 text-white transition-colors"
        >
          Lihat
        </Button>
      </CardFooter>
    </Card>
  );
}
