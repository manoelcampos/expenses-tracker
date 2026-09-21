import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 p-10 text-center">
      <h1 className="text-2xl font-semibold">{t("notFoundTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t("notFoundDescription")}</p>
      <Button render={<Link href="/" />} nativeButton={false} className="mt-2">
        {t("backHome")}
      </Button>
    </div>
  );
}
