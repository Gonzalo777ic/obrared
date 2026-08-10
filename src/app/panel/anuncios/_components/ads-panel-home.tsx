"use client";

import Link from "next/link";
import { useState } from "react";

import { WorkerCard } from "@/components/workers/worker-card";
import { WORKER_NAV_CTA } from "@/constants/user-nav";
import type { MyWorkerAd } from "@/types/worker";

type AdsPanelHomeProps = {
  fullName: string | null;
  roleName: string;
  myAd: MyWorkerAd | null;
};

type PanelSection = "none" | "ads" | "contacts";

export function AdsPanelHome({ fullName, roleName, myAd }: AdsPanelHomeProps) {
  const [activeSection, setActiveSection] = useState<PanelSection>("none");

  const toggleSection = (section: Exclude<PanelSection, "none">) => {
    setActiveSection((current) => (current === section ? "none" : section));
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
        Panel de anuncios
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
        {fullName?.trim() || "Tu perfil profesional"}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Rol actual: {roleName}. Solo puedes mantener un perfil público en ObraRed,
        ya sea como profesional independiente o como empresa.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => toggleSection("ads")}
          className={`border bg-white p-5 text-left transition-colors ${
            activeSection === "ads"
              ? "border-amber-500 ring-2 ring-amber-500/20"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <h2 className="text-base font-semibold text-slate-900">Mis anuncios</h2>
          <p className="mt-2 text-sm text-slate-500">
            Consulta cómo te ven los clientes en tu distrito.
          </p>
          <p className="mt-2 text-xs font-medium text-amber-700">
            {myAd ? "1 perfil público activo" : "Sin perfil publicado"}
          </p>
        </button>

        <button
          type="button"
          onClick={() => toggleSection("contacts")}
          className={`border bg-white p-5 text-left transition-colors ${
            activeSection === "contacts"
              ? "border-amber-500 ring-2 ring-amber-500/20"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <h2 className="text-base font-semibold text-slate-900">Contactos</h2>
          <p className="mt-2 text-sm text-slate-500">
            Revisa solicitudes de clientes interesados en tus servicios.
          </p>
        </button>
      </div>

      {activeSection === "ads" ? (
        <div className="mt-6 border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Tu anuncio publicado
          </h3>

          {!myAd ? (
            <div className="mt-4 border border-dashed border-slate-300 px-4 py-8 text-center">
              <p className="text-sm text-slate-600">
                Aún no tienes un perfil público. Solo puedes publicar uno por
                cuenta.
              </p>
              <Link
                href={WORKER_NAV_CTA.offerServices.href}
                className="mt-3 inline-flex items-center justify-center bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Publicar mi perfil
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <WorkerCard
                worker={myAd}
                layout="horizontal"
                isAuthenticated
                senderName={fullName}
              />
              <div className="grid gap-2 border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 sm:grid-cols-2">
                {myAd.publisherType === "company" ? (
                  <>
                    <p>
                      <span className="font-semibold text-slate-900">RUC: </span>
                      {myAd.documentNumber}
                    </p>
                    {myAd.contactPersonName ? (
                      <p>
                        <span className="font-semibold text-slate-900">
                          Contacto:{" "}
                        </span>
                        {myAd.contactPersonName}
                        {myAd.contactPersonRole
                          ? ` · ${myAd.contactPersonRole}`
                          : ""}
                      </p>
                    ) : null}
                    {myAd.categoryNames.length > 0 ? (
                      <p className="sm:col-span-2">
                        <span className="font-semibold text-slate-900">
                          Líneas de servicio:{" "}
                        </span>
                        {myAd.categoryNames.join(" · ")}
                      </p>
                    ) : null}
                  </>
                ) : null}
                {myAd.presentation ? (
                  <p className="sm:col-span-2">
                    <span className="font-semibold text-slate-900">
                      Presentación:{" "}
                    </span>
                    {myAd.presentation}
                  </p>
                ) : null}
                <p>
                  <span className="font-semibold text-slate-900">
                    WhatsApp:{" "}
                  </span>
                  {myAd.whatsapp}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    {myAd.publisherType === "company"
                      ? "Años de operación: "
                      : "Experiencia: "}
                  </span>
                  {myAd.yearsOfExperience} año
                  {myAd.yearsOfExperience === 1 ? "" : "s"}
                </p>
                {myAd.coverageDistricts.length > 0 ? (
                  <p className="sm:col-span-2">
                    <span className="font-semibold text-slate-900">
                      Cobertura:{" "}
                    </span>
                    {myAd.coverageDistricts
                      .map((item) => `${item.districtName}, ${item.cityName}`)
                      .join(" · ")}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {activeSection === "contacts" ? (
        <div className="mt-6 border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Contactos</h3>
          <p className="mt-2 text-sm text-slate-500">
            Próximamente podrás revisar aquí las solicitudes de clientes
            interesados en tus servicios.
          </p>
        </div>
      ) : null}

      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
