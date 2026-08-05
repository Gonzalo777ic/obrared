import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 text-center">
        <Image
          src="/webp/logo-uso-color.webp"
          alt="ObraRed — Conectamos talento. Construimos futuro."
          width={200}
          height={70}
          className="h-12 w-auto sm:h-14"
        />
        <p className="text-[11px] text-slate-500">
          © {new Date().getFullYear()} ObraRed. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
